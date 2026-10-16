import React, { useEffect, useState } from 'react';
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
  Film,
  Sparkles,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
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
  const [selectedMethod, setSelectedMethod] = useState('VNPAY');
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  // Bộ đếm ngược thời gian giữ ghế
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
      const res = await paymentApi.createPayment(bookingId, selectedMethod);
      if (selectedMethod === 'VNPAY' && res?.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        navigate(`/payment-result?method=${selectedMethod}&vnp_TxnRef=${bookingId}&vnp_ResponseCode=00`);
      }
    } catch (err) {
      toast.error(err.message || 'Thanh toán thất bại, vui lòng thử lại');
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

  const paymentMethods = [
    {
      id: 'VNPAY',
      title: 'Cổng VNPAY',
      desc: 'Thẻ ATM nội địa, QR Pay, Visa/Mastercard',
      icon: CreditCard,
      badge: 'Khuyên Dùng',
    },
    {
      id: 'BANKING',
      title: 'Chuyển Khoản Ngân Hàng',
      desc: 'Quét mã QR chuyển khoản nhanh 24/7',
      icon: Building,
      badge: 'Tự Động',
    },
    {
      id: 'CASH',
      title: 'Tiền Mặt Tại Quầy',
      desc: 'Thanh toán trực tiếp khi nhận vé tại rạp',
      icon: Wallet,
      badge: 'Tại Rạp',
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
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
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
              <p>• Vé đã thanh toán thành công không hỗ trợ hoàn tiền trực tuyến theo quy định của cụm rạp.</p>
              <p>• Vui lòng xuất trình mã QR check-in tại quầy soát vé 15 phút trước giờ chiếu.</p>
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
                    <span>Đang Khởi Tạo Giao Dịch...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Thanh Toán {formatVND(booking.totalAmount)}</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
