import React, { useState } from 'react';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Film, 
  MapPin, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Armchair, 
  Sparkles,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { staffApi } from '../api';
import { useAuth } from '../store/AuthContext';

export const StaffTicketScannerPage = () => {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);

  const handleInspect = async (e) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      toast.warning('Vui lòng nhập mã QR Code hoặc Mã Đặt Vé');
      return;
    }

    try {
      setLoading(true);
      setTicketInfo(null);
      const data = await staffApi.checkTicket(code.trim());
      setTicketInfo(data);
      toast.success('Đã tìm thấy thông tin vé!');
    } catch (err) {
      toast.error(err.message || 'Không tìm thấy thông tin vé');
      setTicketInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!code.trim()) return;

    try {
      setCheckInLoading(true);
      const data = await staffApi.checkIn(code.trim());
      setTicketInfo(data);
      toast.success('✓ Check-in thành công! Mời khách vào phòng chiếu.');
    } catch (err) {
      toast.error(err.message || 'Check-in thất bại');
    } finally {
      setCheckInLoading(false);
    }
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0) + ' ₫';
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header nhân viên soát vé */}
        <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono font-bold mb-3">
                <QrCode className="w-3.5 h-3.5" />
                <span>CINEPRIME STAFF CONSOLE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                Cổng Soát Vé & Quét Mã QR
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Kiểm tra tính hợp lệ của vé và xác nhận khách vào phòng chiếu
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold font-mono">
                {user?.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-snug">{user?.fullName || user?.username}</p>
                <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase tracking-wider">
                  Vai trò: {user?.role || 'STAFF'}
                </span>
              </div>
            </div>
          </div>

          {/* Form nhập/quét mã */}
          <form onSubmit={handleInspect} className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                <QrCode className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Nhập mã QR Code hoặc mã đơn đặt vé (VD: BK-1791...)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-2xl text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="py-3.5 px-6 rounded-2xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Kiểm Tra Vé</span>
            </button>
          </form>
        </div>

        {/* Kết quả kiểm tra vé */}
        {ticketInfo && (
          <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in space-y-6">
            
            {/* Thanh trạng thái vé */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-neutral-500 block mb-1">MÃ ĐƠN HÀNG</span>
                <span className="text-xl font-bold font-mono text-amber-400 tracking-wider">
                  #{ticketInfo.bookingRef}
                </span>
              </div>

              <div>
                {ticketInfo.isAllUsed ? (
                  <div className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neutral-400" />
                    <span>VÉ ĐÃ QUA CỬA (USED)</span>
                  </div>
                ) : ticketInfo.bookingStatus === 'PAID' ? (
                  <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>VÉ HỢP LỆ - CHƯA VÀO RẠP</span>
                  </div>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>TRẠNG THÁI: {ticketInfo.bookingStatus}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin phim & rạp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Film className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-neutral-500 block">TÊN BỘ PHIM</span>
                    <h3 className="text-lg font-extrabold text-white font-display">{ticketInfo.movieName}</h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[11px] font-mono font-bold">
                      {ticketInfo.format} DIGITAL
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-neutral-500 block">RẠP & PHÒNG CHIẾU</span>
                    <p className="text-sm font-semibold text-neutral-200">{ticketInfo.cinemaName}</p>
                    <p className="text-xs text-neutral-400">{ticketInfo.roomName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-neutral-500 block">SUẤT CHIẾU</span>
                    <p className="text-sm font-bold text-white font-mono">
                      {ticketInfo.startTime} - Ngày {ticketInfo.showDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng & ghế */}
              <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-neutral-500 block">KHÁCH HÀNG</span>
                    <p className="text-sm font-bold text-white">{ticketInfo.customerName}</p>
                    <p className="text-xs text-neutral-400">{ticketInfo.customerPhone || ticketInfo.customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Armchair className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-neutral-500 block">GHẾ ĐÃ ĐẶT</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {ticketInfo.seats.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-amber-400 font-mono text-xs font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-between items-center">
                  <span className="text-xs font-mono text-neutral-400">TỔNG TIỀN ĐÃ TRẢ:</span>
                  <span className="text-lg font-extrabold text-amber-400 font-mono">
                    {formatVND(ticketInfo.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Nút hành động Check-in */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={checkInLoading || ticketInfo.isAllUsed || ticketInfo.bookingStatus !== 'PAID'}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-400/20 flex items-center justify-center gap-3 cursor-pointer"
              >
                {checkInLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang Xác Nhận...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {ticketInfo.isAllUsed ? 'Vé Đã Được Check-in Trước Đó' : '✓ Xác Nhận Cho Khách Vào Phòng Chiếu'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
