import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Home, Ticket, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const responseCode = searchParams.get('vnp_ResponseCode');
  const bookingId = searchParams.get('vnp_TxnRef');
  const transactionNo = searchParams.get('vnp_TransactionNo');
  const method = searchParams.get('method');

  // Success logic: vnp_ResponseCode === '00' OR method is CASH, BANKING, PAYOS
  const isSuccess = responseCode === '00' || method === 'CASH' || method === 'BANKING' || method === 'PAYOS';

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.2 },
    },
  };

  return (
    <div className="min-h-[85vh] bg-[#0b0c10] flex items-center justify-center p-4 sm:p-6 text-neutral-100">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-lg bg-[#0f1117] border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md"
        style={{
          borderColor: isSuccess ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)',
        }}
      >
        {/* Glow ambient background effect */}
        <div
          className={`absolute -top-24 -left-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isSuccess ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        <div
          className={`absolute -bottom-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-15 ${
            isSuccess ? 'bg-amber-400' : 'bg-red-600'
          }`}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Animated Status Icon */}
          <motion.div
            variants={iconVariants}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg ${
              isSuccess
                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/40 text-emerald-400'
                : 'bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/40 text-red-400'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-10 h-10" />
            ) : (
              <XCircle className="w-10 h-10" />
            )}
          </motion.div>

          {/* Heading */}
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1 font-semibold">
            {isSuccess ? 'XÁC NHẬN GIAO DỊCH' : 'THÔNG BÁO LỖI'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-wide mb-3">
            {isSuccess ? 'Đặt Vé Thành Công!' : 'Thanh Toán Thất Bại'}
          </h1>

          <p className="text-neutral-400 text-sm max-w-sm mb-6 leading-relaxed">
            {isSuccess ? (
              method === 'CASH' ? (
                'Đơn đặt vé đã được ghi nhận. Vui lòng thanh toán trực tiếp tại quầy vé CinePrime trước giờ chiếu 15 phút.'
              ) : method === 'PAYOS' ? (
                'Thanh toán chuyển khoản VietQR tự động thành công! Vé xem phim và mã QR check-in đã sẵn sàng.'
              ) : method === 'BANKING' ? (
                'Đơn đặt vé đã được tiếp nhận qua kênh chuyển khoản ngân hàng. Vé điện tử đã sẵn sàng.'
              ) : (
                'Giao dịch thanh toán trực tuyến qua VNPAY đã thành công. Vé xem phim và mã QR check-in đã được cập nhật.'
              )
            ) : (
              'Giao dịch thanh toán không hoàn tất hoặc đã bị hủy từ người dùng. Ghế của bạn vẫn có thể được giữ trong thời gian ngắn hoặc đã được hoàn về phòng chiếu.'
            )}
          </p>

          {/* Transaction Metadata Card */}
          <div className="w-full bg-neutral-950/70 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 mb-8 text-left space-y-2.5 font-mono text-xs">
            {bookingId && (
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/60">
                <span className="text-neutral-500">Mã đơn đặt vé:</span>
                <span className="font-bold text-amber-400 font-sans">#{bookingId}</span>
              </div>
            )}

            {transactionNo && (
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/60">
                <span className="text-neutral-500">Mã giao dịch VNPAY:</span>
                <span className="text-neutral-200">{transactionNo}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500">Hình thức:</span>
              <span className="text-neutral-300">
                {method === 'CASH'
                  ? 'Tiền mặt tại quầy'
                  : method === 'BANKING'
                  ? 'Chuyển khoản VietQR'
                  : 'Cổng VNPAY Sandbox'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-neutral-500">Trạng thái:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  isSuccess
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}
              >
                {isSuccess ? 'ĐÃ XÁC NHẬN (PAID)' : 'THẤT BẠI (FAILED)'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            {isSuccess ? (
              <>
                <Link
                  to="/my-tickets"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Xem Vé Của Tôi</span>
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
    </div>
  );
};
