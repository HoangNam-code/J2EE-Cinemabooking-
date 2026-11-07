import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Home,
  Ticket,
  ShieldCheck,
  Printer,
  Mail,
  QrCode,
  Popcorn,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Loader2,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { bookingApi, paymentApi } from '../api';
import { MovieImage } from '../components/common/MovieImage';
import { TicketPassModal } from '../components/booking/TicketPassModal';
import { toast } from 'sonner';

const formatVND = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price || 0) + ' ₫';
};

export const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const responseCode = searchParams.get('vnp_ResponseCode');
  const bookingId = searchParams.get('vnp_TxnRef') || searchParams.get('bookingId');
  const transactionNo = searchParams.get('vnp_TransactionNo');
  const method = searchParams.get('method') || 'PAYOS';
  const isCancelled = searchParams.get('cancel') === 'true';

  const [booking, setBooking] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(Boolean(bookingId));
  const [showPassModal, setShowPassModal] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  // CHỈ coi là thành công và hiển thị vé khi đơn hàng trong DB thực sự ở trạng thái PAID
  const isSuccess = !isCancelled && booking?.status === 'PAID';

  useEffect(() => {
    if (bookingId) {
      verifyAndFetchBooking();
    }
  }, [bookingId]);

  const verifyAndFetchBooking = async () => {
    try {
      setLoadingBooking(true);
      // 1. Đối chiếu trực tiếp với PayOS xem tiền đã thực sự vào tài khoản chưa
      await paymentApi.checkPayOSStatus(bookingId).catch(() => null);
      // 2. Lấy thông tin đơn hàng từ Database
      const data = await bookingApi.getSummary(bookingId);
      setBooking(data);
      // 3. Nếu đơn đã PAID, đảm bảo gửi Email vé điện tử về hộp thư khách hàng
      if (data && data.status === 'PAID') {
        bookingApi.sendTicketEmail(bookingId).catch(() => null);
      }
    } catch (err) {
      console.error('Không thể tải chi tiết vé sau thanh toán:', err);
    } finally {
      setLoadingBooking(false);
    }
  };

  const handleResendEmail = async () => {
    if (!bookingId || resendingEmail) return;
    try {
      setResendingEmail(true);
      await bookingApi.sendTicketEmail(bookingId);
      toast.success(`Đã gửi lại vé điện tử tới ${booking?.customerEmail || 'email của bạn'}!`);
    } catch (err) {
      toast.error(err.message || 'Không thể gửi email lúc này');
    } finally {
      setResendingEmail(false);
    }
  };

  const firstQrCode =
    booking?.tickets?.[0]?.qrCode ||
    (bookingId ? `CINEPRIME|ID:${bookingId}|REF:BK${String(bookingId).padStart(6, '0')}` : 'CINEPRIME');

  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-[88vh] bg-[#0b0c10] flex items-center justify-center py-10 px-4 sm:px-6 text-neutral-100">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-2xl bg-[#0f1117] border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md"
        style={{
          borderColor: isSuccess ? 'rgba(52, 211, 153, 0.35)' : 'rgba(239, 68, 68, 0.35)',
        }}
      >
        {/* Glow ambient background effect */}
        <div
          className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isSuccess ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        <div
          className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-15 ${
            isSuccess ? 'bg-amber-400' : 'bg-red-600'
          }`}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Status Icon */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
              isSuccess
                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/40 text-emerald-400'
                : 'bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/40 text-red-400'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
          </div>

          {/* Heading */}
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSuccess ? 'THANH TOÁN THÀNH CÔNG & XUẤT VÉ' : 'THÔNG BÁO GIAO DỊCH'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-wide mb-2">
            {isSuccess ? 'Vé Điện Tử Của Bạn Đã Sẵn Sàng!' : 'Thanh Toán Chưa Hoàn Tất'}
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mb-5 leading-relaxed">
            {isSuccess ? (
              method === 'PAYOS' ? (
                'Ngân hàng đã xác nhận chuyển khoản VietQR thành công. Dưới đây là thẻ vé điện tử kèm mã QR Check-in của bạn.'
              ) : method === 'CASH' ? (
                'Đơn đặt vé đã được ghi nhận. Vui lòng xuất trình mã QR bên dưới tại quầy vé CinePrime.'
              ) : (
                'Giao dịch thanh toán trực tuyến thành công. Vé xem phim và mã QR Check-in đã được kích hoạt.'
              )
            ) : (
              'Giao dịch thanh toán chưa hoàn tất hoặc đã bị hủy. Bạn có thể thử thanh toán lại trong thời gian giữ ghế.'
            )}
          </p>

          {/* Email notification banner when success */}
          {isSuccess && booking?.customerEmail && (
            <div className="w-full mb-6 px-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Vé điện tử, bảng kê giá tiền và mã QR đã được gửi tới:{' '}
                  <strong className="text-white">{booking.customerEmail}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resendingEmail}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-semibold text-[11px] cursor-pointer disabled:opacity-50"
              >
                {resendingEmail ? 'Đang gửi...' : 'Gửi lại Email'}
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* THẺ VÉ ĐIỆN TỬ & MÃ QR CHECK-IN TRỰC TIẾP CHO KHÁCH HÀNG       */}
          {/* ============================================================== */}
          {loadingBooking && (
            <div className="w-full py-10 flex flex-col items-center justify-center gap-2 text-xs text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              <span>Đang đối soát giao dịch ngân hàng và xuất vé điện tử...</span>
            </div>
          )}

          {isSuccess && booking && (
            <div className="w-full bg-neutral-950/90 border border-amber-400/30 rounded-2xl overflow-hidden mb-6 text-left shadow-xl">
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-amber-500/15 via-neutral-900 to-emerald-500/10 px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold font-display tracking-wider uppercase text-white">
                    CINEPRIME BOARDING PASS
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  #{booking.bookingRef || `BK${String(booking.bookingId).padStart(6, '0')}`}
                </span>
              </div>

              {/* Ticket Body */}
              <div className="p-5 space-y-5">
                {/* Movie + Poster + Showtime */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {booking.posterUrl && (
                    <div className="w-20 h-28 rounded-xl overflow-hidden border border-neutral-800 shrink-0 hidden sm:block">
                      <MovieImage
                        src={booking.posterUrl}
                        alt={booking.movieName}
                        fallbackTitle={booking.movieName}
                        aspect="poster"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-2 w-full">
                    <h2 className="text-lg sm:text-xl font-extrabold font-display text-white">
                      {booking.movieName || 'Vé Xem Phim CinePrime'}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono">
                      <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-500 uppercase">Cụm rạp & Phòng</div>
                        <div className="text-white font-semibold truncate">{booking.cinemaName}</div>
                        <div className="text-amber-400 text-[11px] font-bold">{booking.roomName}</div>
                      </div>

                      <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-500 uppercase">Suất chiếu</div>
                        <div className="text-amber-400 font-bold">
                          {booking.startTime?.substring(0, 5) || booking.startTime}
                        </div>
                        <div className="text-neutral-300 text-[11px]">{booking.showDate}</div>
                      </div>

                      <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800/80 col-span-2 sm:col-span-1">
                        <div className="text-[10px] text-neutral-500 uppercase">Ghế ngồi ({booking.tickets?.length || 0})</div>
                        <div className="text-rose-400 font-extrabold text-sm">
                          {booking.tickets?.map((t) => t.seatCode).join(', ') || 'N/A'}
                        </div>
                        <div className="text-neutral-400 text-[10px]">
                          {booking.tickets?.map((t) => t.seatType).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foods / Concessions if any */}
                {booking.foods && booking.foods.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 text-xs font-mono space-y-1.5">
                    <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                      <Popcorn className="w-3.5 h-3.5" />
                      <span>Bắp nước & Combo đã mua:</span>
                    </div>
                    <div className="space-y-1">
                      {booking.foods.map((f, idx) => (
                        <div key={idx} className="flex justify-between text-neutral-300">
                          <span>
                            {f.foodName} <strong className="text-amber-400">x{f.quantity}</strong>
                          </span>
                          <span className="text-white font-semibold">
                            {formatVND(f.subtotal || f.price * f.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Financial Receipt Summary */}
                <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800/80 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-neutral-400">
                    <span>Tiền vé ({booking.tickets?.length || 0} ghế):</span>
                    <span className="text-neutral-200">{formatVND(booking.ticketSubtotal)}</span>
                  </div>
                  {booking.foodSubtotal > 0 && (
                    <div className="flex justify-between text-neutral-400">
                      <span>Tiền bắp nước:</span>
                      <span className="text-neutral-200">{formatVND(booking.foodSubtotal)}</span>
                    </div>
                  )}
                  {booking.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Khuyến mãi giảm giá:</span>
                      <span>-{formatVND(booking.discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
                    <span className="text-white font-bold font-sans text-sm">Tổng tiền đã thanh toán:</span>
                    <span className="text-lg font-extrabold text-amber-400">
                      {formatVND(booking.totalAmount)}
                    </span>
                  </div>
                  <div className="pt-1 flex flex-wrap justify-between gap-2 text-[11px] text-neutral-400">
                    <span>
                      Kênh TT:{' '}
                      <strong className="text-emerald-400">
                        {method === 'PAYOS' || booking.paymentMethod === 'BANKING'
                          ? 'VietQR (PayOS)'
                          : method === 'CASH'
                          ? 'Tiền mặt'
                          : 'VNPAY'}
                      </strong>
                    </span>
                    {(booking.transactionId || transactionNo) && (
                      <span>
                        Mã GD: <strong className="text-neutral-200">{booking.transactionId || transactionNo}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className="relative py-1 flex items-center justify-between">
                  <div className="flex-1 border-t-2 border-dashed border-neutral-800" />
                  <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-amber-400">
                    MÃ QR SOÁT VÉ TẠI RẠP
                  </span>
                  <div className="flex-1 border-t-2 border-dashed border-neutral-800" />
                </div>

                {/* QR Check-in Box */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-neutral-900 rounded-2xl border border-amber-400/30">
                  <div className="p-3 bg-white rounded-2xl shadow-lg shrink-0">
                    <QRCodeSVG value={firstQrCode} size={135} level="H" includeMargin={false} />
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VÉ HỢP LỆ - SẴN SÀNG CHECK-IN</span>
                    </div>
                    <div className="text-xs font-mono text-neutral-300">
                      Mã định danh vé:{' '}
                      <span className="text-amber-400 font-bold break-all">{firstQrCode}</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Đưa mã QR này cho nhân viên soát vé tại quầy hoặc cổng Check-in tự động trước giờ chiếu 15 phút.
                    </p>
                    <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPassModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Phóng to thẻ vé</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>In vé / Lưu PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback Transaction Metadata Card if booking hasn't loaded or failed */}
          {!booking && (
            <div className="w-full bg-neutral-950/70 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 mb-6 text-left space-y-2.5 font-mono text-xs">
              {bookingId && (
                <div className="flex justify-between items-center py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-500">Mã đơn đặt vé:</span>
                  <span className="font-bold text-amber-400 font-sans">#{bookingId}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-500">Trạng thái:</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                    isSuccess
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}
                >
                  {isSuccess ? 'ĐÃ XÁC NHẬN (PAID)' : 'CHƯA HOÀN TẤT'}
                </span>
              </div>
            </div>
          )}

          {/* Bottom Navigation Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            {isSuccess ? (
              <>
                <Link
                  to="/my-tickets"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Xem Trong Kho Vé Của Tôi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/"
                  className="py-3 px-5 rounded-xl text-sm font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Về Trang Chủ</span>
                </Link>
              </>
            ) : (
              <>
                {bookingId ? (
                  <button
                    onClick={() => navigate(`/payment/${bookingId}`)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Thử Lại Thanh Toán</span>
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Home className="w-4 h-4" />
                    <span>Đặt Vé Khác</span>
                  </Link>
                )}
                <Link
                  to="/"
                  className="py-3 px-5 rounded-xl text-sm font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Về Trang Chủ</span>
                </Link>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Hệ thống vé điện tử CinePrime Cinemas</span>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Boarding Pass Modal */}
      {showPassModal && booking && (
        <TicketPassModal booking={booking} onClose={() => setShowPassModal(false)} />
      )}
    </div>
  );
};
