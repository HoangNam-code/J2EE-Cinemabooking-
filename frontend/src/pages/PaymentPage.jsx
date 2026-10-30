import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Building,
  Wallet,
  Clock,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Ticket,
  Popcorn,
  Sparkles,
  Loader2,
  QrCode,
  Copy,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { bookingApi, paymentApi } from '../api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MovieImage } from '../components/common/MovieImage';

const formatVND = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price || 0) + ' ₫';
};

export const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('PAYOS');
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600);

  // Trạng thái modal thanh toán VietQR PayOS
  const [payosModal, setPayosModal] = useState(false);
  const [payosData, setPayosData] = useState(null);
  const [qrSecondsLeft, setQrSecondsLeft] = useState(300); // 5 phút = 300 giây
  const [copiedField, setCopiedField] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  // Bộ đếm ngược thời gian giữ ghế tổng thể (10 phút)
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error('Hết thời gian giữ ghế! Đơn hàng đã bị hủy tự động.');
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, navigate]);

  // Bộ đếm ngược thời gian tồn tại của mã QR (đúng 5 phút = 300 giây)
  useEffect(() => {
    if (!payosModal || qrSecondsLeft <= 0 || paymentSuccess) return;

    const qrInterval = setInterval(() => {
      setQrSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(qrInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(qrInterval);
  }, [payosModal, qrSecondsLeft, paymentSuccess]);

  // Polling tự động kiểm tra xem tiền đã vào tài khoản chưa (mỗi 2.5 giây)
  useEffect(() => {
    if (!payosModal || qrSecondsLeft <= 0 || paymentSuccess) return;

    let isPolling = false;
    const pollInterval = setInterval(async () => {
      if (isPolling) return;
      isPolling = true;
      try {
        const res = await paymentApi.checkPayOSStatus(bookingId);
        if (res && res.paid) {
          clearInterval(pollInterval);
          setPaymentSuccess(true);
          toast.success('Chuyển khoản thành công! Vé xem phim của bạn đã sẵn sàng.');
          setTimeout(() => {
            navigate(`/payment-result?method=PAYOS&vnp_TxnRef=${bookingId}&vnp_ResponseCode=00`);
          }, 1200);
        }
      } catch (err) {
        console.error('Lỗi kiểm tra trạng thái PayOS:', err);
      } finally {
        isPolling = false;
      }
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [payosModal, qrSecondsLeft, paymentSuccess, bookingId, navigate]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getSummary(bookingId);
      setBooking(data);
      if (data.remainingSeconds !== undefined && data.remainingSeconds !== null) {
        setSecondsLeft(data.remainingSeconds);
      }
    } catch (err) {
      toast.error(err.message || 'Không thể tải thông tin đặt vé');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (secondsLeft <= 0) {
      toast.error('Thời gian thanh toán đã hết hạn');
      navigate('/');
      return;
    }

    try {
      setSubmitting(true);

      // 1. Trường hợp chọn PayOS (VietQR tự động 5 phút)
      if (selectedMethod === 'PAYOS') {
        const res = await paymentApi.createPayment(bookingId, 'PAYOS');
        setPayosData(res);
        setQrSecondsLeft(300); // Đặt đếm ngược đúng 5 phút
        setPaymentSuccess(false);
        setPayosModal(true);
        return;
      }

      // 2. Trường hợp chọn VNPAY
      if (selectedMethod === 'VNPAY') {
        const res = await paymentApi.createPayment(bookingId, 'VNPAY');
        if (res?.paymentUrl) {
          window.location.href = res.paymentUrl;
        } else {
          navigate(`/payment-result?method=VNPAY&vnp_TxnRef=${bookingId}&vnp_ResponseCode=00`);
        }
        return;
      }

      // 3. Tiền mặt tại quầy
      await paymentApi.createPayment(bookingId, selectedMethod);
      navigate(`/payment-result?method=${selectedMethod}&vnp_TxnRef=${bookingId}&vnp_ResponseCode=00`);
    } catch (err) {
      toast.error(err.message || 'Thanh toán thất bại, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedField(fieldName);
    toast.success(`Đã sao chép ${fieldName}`);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleRegenerateQR = async () => {
    try {
      setSubmitting(true);
      const res = await paymentApi.createPayment(bookingId, 'PAYOS');
      setPayosData(res);
      setQrSecondsLeft(300);
      setPaymentSuccess(false);
      toast.success('Đã làm mới mã QR thành công (5 phút)');
    } catch (err) {
      toast.error(err.message || 'Không thể tạo lại mã QR');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải thông tin thanh toán vé..." />;
  }

  if (!booking) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isExpiringSoon = secondsLeft < 120; // < 2 minutes

  const qrMinutes = Math.floor(qrSecondsLeft / 60);
  const qrSeconds = qrSecondsLeft % 60;

  const paymentMethods = [
    {
      id: 'PAYOS',
      title: 'Chuyển Khoản VietQR (PayOS)',
      desc: 'Quét mã QR tự động bằng mọi App Ngân hàng & Ví (MB, VCB, Techcombank, MoMo...)',
      icon: QrCode,
      badge: 'Khuyên Dùng',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'VNPAY',
      title: 'Cổng VNPAY',
      desc: 'Thẻ ATM nội địa, Thẻ quốc tế Visa/Mastercard',
      icon: CreditCard,
      badge: 'Trực Tuyến',
      badgeColor: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    },
    {
      id: 'CASH',
      title: 'Tiền Mặt Tại Quầy',
      desc: 'Thanh toán trực tiếp khi nhận vé tại quầy rạp',
      icon: Wallet,
      badge: 'Tại Rạp',
      badgeColor: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] py-8 px-4 sm:px-6 lg:px-8 text-neutral-100">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BƯỚC THANH TOÁN AN TOÀN</span>
          </div>
        </div>

        {/* Countdown Timer Banner */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-2xl border transition-colors ${
            isExpiringSoon
              ? 'bg-red-950/30 border-red-500/50 text-red-200'
              : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
          } backdrop-blur-md`}
        >
          <div className="flex items-center gap-3.5 mb-3 sm:mb-0">
            <div
              className={`p-2.5 rounded-xl ${
                isExpiringSoon ? 'bg-red-500/20 text-red-400' : 'bg-amber-400/20 text-amber-400'
              }`}
            >
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-white">
                Thời Gian Giữ Ghế & Thanh Toán
              </h3>
              <p className="text-xs text-neutral-400">
                Ghế sẽ tự động giải phóng khi bộ đếm chạm 00:00
              </p>
            </div>
          </div>

          <div
            className={`font-mono text-2xl sm:text-3xl font-extrabold tracking-wider px-4 py-1.5 rounded-xl border ${
              isExpiringSoon
                ? 'bg-red-900/40 border-red-500/40 text-red-400 animate-pulse'
                : 'bg-neutral-900/80 border-neutral-800 text-amber-400'
            }`}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Column: Payment Methods & Details */}
          <div className="lg:col-span-7 space-y-6">

            {/* Payment Method Selector */}
            <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <h2 className="text-lg font-bold font-display text-white mb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>Phương Thức Thanh Toán</span>
              </h2>
              <p className="text-xs text-neutral-400 mb-5">
                Vui lòng lựa chọn hình thức thanh toán thuận tiện nhất
              </p>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/10 ring-1 ring-amber-400/50'
                          : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                          isSelected ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                            {method.title}
                          </span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${method.badgeColor}`}>
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                          {method.desc}
                        </p>
                      </div>

                      <div className="mt-1">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'border-amber-400 bg-amber-400' : 'border-neutral-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-neutral-950" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-5 border-t border-neutral-800/80 flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Thanh toán được mã hóa an toàn SSL 256-bit</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Note on cancellation / rules */}
            <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-4 text-xs text-neutral-400 space-y-1.5 font-mono">
              <p className="text-amber-400/90 font-semibold font-sans">Lưu ý khi đặt vé:</p>
              <p>• Mã VietQR tồn tại trong 5 phút. Vui lòng chuyển khoản đúng số tiền và nội dung hiển thị.</p>
              <p>• Vé đã thanh toán thành công sẽ được kích hoạt tức thì kèm mã QR check-in gửi về email.</p>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl sticky top-6 space-y-5">

              {/* Card Header & Movie details */}
              <div className="flex gap-4 items-start">
                <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-neutral-800 shadow-md">
                  <MovieImage
                    src={booking.posterUrl}
                    alt={booking.movieName || 'Phim'}
                    fallbackTitle={booking.movieName}
                    aspect="poster"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono tracking-wider uppercase text-amber-400 font-semibold">
                    ĐƠN #{booking.bookingId}
                  </div>
                  <h3 className="text-base font-bold font-display text-white mt-0.5 line-clamp-2">
                    {booking.movieName}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-1 font-mono">
                    {booking.cinemaName}
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">
                    {booking.roomName}
                  </div>
                  <div className="text-xs text-amber-400/90 font-mono mt-1">
                    {booking.showDate} · {booking.startTime?.substring(0, 5) || booking.startTime}
                  </div>
                </div>
              </div>

              {/* Tickets List */}
              <div className="border-t border-neutral-800/80 pt-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-neutral-400 font-semibold">
                  <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  <span>Danh sách ghế ({booking.tickets?.length || 0})</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {booking.tickets?.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-300">
                        Ghế <strong className="text-amber-400">{t.seatCode}</strong> ({t.seatType || 'STANDARD'})
                      </span>
                      <span className="text-neutral-100 font-medium">
                        {formatVND(t.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foods List if any */}
              {booking.foods && booking.foods.length > 0 && (
                <div className="border-t border-neutral-800/80 pt-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-neutral-400 font-semibold">
                    <Popcorn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bắp nước kèm theo</span>
                  </div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {booking.foods.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-300 truncate max-w-[180px]">
                          {f.foodName} <span className="text-neutral-500">x{f.quantity}</span>
                        </span>
                        <span className="text-neutral-100 font-medium">
                          {formatVND(f.subtotal || f.price * f.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial calculations */}
              <div className="border-t border-neutral-800/80 pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Tiền vé:</span>
                  <span className="text-neutral-200">
                    {formatVND(booking.ticketSubtotal || booking.tickets?.reduce((acc, t) => acc + (t.price || 0), 0))}
                  </span>
                </div>

                {booking.foodSubtotal > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Tiền bắp nước:</span>
                    <span className="text-neutral-200">{formatVND(booking.foodSubtotal)}</span>
                  </div>
                )}

                {booking.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Khuyến mãi ({booking.promotionCode || 'DISCOUNT'}):</span>
                    <span>-{formatVND(booking.discountAmount)}</span>
                  </div>
                )}

                <div className="border-t border-neutral-800 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white font-sans">Tổng thanh toán:</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
                    {formatVND(booking.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Submit Payment Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={submitting || secondsLeft <= 0}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang Khởi Tạo Thanh Toán...</span>
                  </>
                ) : selectedMethod === 'PAYOS' ? (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Hiện Mã VietQR Thanh Toán</span>
                  </>
                ) : selectedMethod === 'VNPAY' ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Chuyển Đến Cổng VNPAY</span>
                  </>
                ) : (
                  <>
                    <span>Xác Nhận Đặt Vé</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* POPUP MODAL MÃ QR THANH TOÁN PAYOS (VIETQR) 5 PHÚT       */}
      {/* ======================================================== */}
      {payosModal && payosData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0f1117] border border-amber-400/30 rounded-3xl p-6 shadow-2xl overflow-hidden my-8">

            {/* Ambient glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Quét Mã VietQR Chuyển Khoản</h3>
                  <p className="text-xs text-neutral-400">Tự động nhận diện & xuất vé sau khi nhận tiền</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPayosModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trạng thái thành công */}
            {paymentSuccess ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">Thanh Toán Thành Công!</h4>
                <p className="text-sm text-neutral-300">
                  Đã nhận được tiền. Đang chuyển bạn đến trang nhận vé...
                </p>
              </div>
            ) : qrSecondsLeft <= 0 ? (
              /* Trạng thái hết hạn 5 phút */
              <div className="py-10 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Mã QR Đã Hết Hạn</h4>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Mã QR này chỉ có hiệu lực trong 5 phút để bảo vệ phiên giao dịch. Vui lòng tạo mã QR mới.
                </p>
                <button
                  type="button"
                  onClick={handleRegenerateQR}
                  disabled={submitting}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs text-neutral-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <RefreshCw className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                  <span>Tạo Lại Mã QR Mới (5 phút)</span>
                </button>
              </div>
            ) : (
              /* Hiển thị QR và thông tin chuyển khoản */
              <div className="mt-5 space-y-5">

                {/* Timer đếm ngược 5 phút */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Mã QR có hiệu lực trong:</span>
                  </div>
                  <div className="font-mono text-sm font-extrabold text-amber-400">
                    {String(qrMinutes).padStart(2, '0')}:{String(qrSeconds).padStart(2, '0')}
                  </div>
                </div>

                {/* Vùng hiển thị mã QR */}
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner border border-neutral-300">
                  {payosData.qrUrl ? (
                    <img
                      src={payosData.qrUrl}
                      alt="VietQR PayOS"
                      className="w-64 h-auto max-h-72 object-contain"
                    />
                  ) : payosData.qrCode ? (
                    <QRCodeSVG
                      value={payosData.qrCode}
                      size={220}
                      level="M"
                      includeMargin={true}
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-neutral-500 text-xs">
                      Không tải được mã QR
                    </div>
                  )}
                  <p className="text-[11px] font-sans text-neutral-600 mt-2 text-center">
                    Mở ứng dụng ngân hàng hoặc ví điện tử bất kỳ để quét mã VietQR
                  </p>
                </div>

                {/* Thông tin chuyển khoản chi tiết */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 space-y-2.5 text-xs font-mono">

                  {/* Ngân hàng */}
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Ngân hàng:</span>
                    <span className="text-white font-semibold">{payosData.bin || 'VietinBank / MB'}</span>
                  </div>

                  {/* Số tài khoản */}
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold tracking-wider">{payosData.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(payosData.accountNumber, 'Số tài khoản')}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Sao chép số tài khoản"
                      >
                        {copiedField === 'Số tài khoản' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Chủ tài khoản */}
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Chủ tài khoản:</span>
                    <span className="text-white uppercase font-semibold">{payosData.accountName}</span>
                  </div>

                  {/* Số tiền */}
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Số tiền:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold text-sm">{formatVND(payosData.amount || booking.totalAmount)}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(payosData.amount || booking.totalAmount, 'Số tiền')}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Sao chép số tiền"
                      >
                        {copiedField === 'Số tiền' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Nội dung chuyển khoản */}
                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-neutral-400">
                    <span>Nội dung CK:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {payosData.description}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(payosData.description, 'Nội dung chuyển khoản')}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Sao chép nội dung"
                      >
                        {copiedField === 'Nội dung chuyển khoản' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status indicator: Polling */}
                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center gap-2.5 text-xs text-amber-300">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                  <span>Đang chờ chuyển khoản... Hệ thống sẽ tự động xuất vé ngay khi tiền vào.</span>
                </div>

                {/* Link mở cổng PayOS bên ngoài nếu cần */}
                {payosData.paymentUrl && (
                  <div className="text-center pt-1">
                    <a
                      href={payosData.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 underline underline-offset-4 transition-colors"
                    >
                      <span>Mở trang thanh toán PayOS trên tab mới</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
