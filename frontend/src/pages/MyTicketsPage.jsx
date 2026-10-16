import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock, 
  X, 
  Eye, 
  Trash2, 
  AlertCircle, 
  Plus, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { bookingApi } from '../api';
import { useAuth } from '../store/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MovieImage } from '../components/common/MovieImage';
import { TicketPassModal } from '../components/booking/TicketPassModal';

const formatVND = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price || 0) + ' ₫';
};

export const MyTicketsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PAID, PENDING, CANCELLED

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      toast.error('Lỗi tải danh sách vé: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    // Show toast with action confirmation instead of window.confirm
    toast('Xác nhận hủy đơn đặt vé?', {
      description: `Bạn có chắc muốn hủy đơn đặt vé #${bookingId}? Ghế sẽ được giải phóng cho khán giả khác.`,
      action: {
        label: 'Xác Nhận Hủy',
        onClick: async () => {
          try {
            setCancellingId(bookingId);
            await bookingApi.cancel(bookingId);
            toast.success(`Đã hủy thành công đơn vé #${bookingId}`);
            loadBookings();
          } catch (err) {
            toast.error(err.message || 'Không thể hủy đơn vé này');
          } finally {
            setCancellingId(null);
          }
        },
      },
      cancel: {
        label: 'Không',
        onClick: () => {},
      },
      duration: 6000,
    });
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải danh sách vé của bạn..." />;
  }

  // Filter bookings according to activeTab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PAID') return b.status === 'PAID';
    if (activeTab === 'PENDING') return b.status === 'PENDING';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED' || b.status === 'EXPIRED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ĐÃ THANH TOÁN
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            ĐANG CHỜ THANH TOÁN
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
            HẾT HẠN
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            ĐÃ HỦY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] py-8 px-4 sm:px-6 lg:px-8 text-neutral-100">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
              <Ticket className="w-4 h-4" />
              <span>LỊCH SỬ GIAO DỊCH VÉ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Vé Xem Phim Của Tôi
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Quản lý danh sách vé đã đặt, kiểm tra mã check-in vào phòng chiếu CinePrime
            </p>
          </div>

          <Link
            to="/"
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Đặt Thêm Vé Mới</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {[
            { id: 'ALL', label: 'Tất Cả', count: bookings.length },
            { id: 'PAID', label: 'Đã Thanh Toán', count: bookings.filter((b) => b.status === 'PAID').length },
            { id: 'PENDING', label: 'Đang Chờ', count: bookings.filter((b) => b.status === 'PENDING').length },
            { id: 'CANCELLED', label: 'Đã Hủy / Hết Hạn', count: bookings.filter((b) => b.status === 'CANCELLED' || b.status === 'EXPIRED').length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-neutral-950 text-amber-400 font-bold' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
              <Ticket className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Không Tìm Thấy Đơn Đặt Vé Nào
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto">
                {activeTab === 'ALL'
                  ? 'Bạn chưa có giao dịch đặt vé nào tại CinePrime. Hãy khám phá ngay các suất chiếu hôm nay!'
                  : 'Không có đơn vé nào trong mục phân loại này.'}
              </p>
            </div>
            {activeTab === 'ALL' && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer shadow-lg shadow-amber-400/20"
              >
                <span>Khám Phá Phim Đang Chiếu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b.bookingId}
                className={`bg-[#0f1117] border rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center ${
                  b.status === 'PAID'
                    ? 'border-emerald-500/20 hover:border-emerald-500/40 shadow-sm'
                    : b.status === 'PENDING'
                    ? 'border-amber-400/30 hover:border-amber-400/50'
                    : 'border-neutral-800 hover:border-neutral-700 opacity-80'
                }`}
              >
                {/* Poster Thumbnail */}
                <div className="w-24 sm:w-28 h-36 shrink-0 rounded-xl overflow-hidden border border-neutral-800/80 shadow-md">
                  <MovieImage
                    src={b.posterUrl}
                    alt={b.movieName || 'Phim'}
                    fallbackTitle={b.movieName}
                    aspect="poster"
                  />
                </div>

                {/* Center Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider text-neutral-400">
                      MÃ ĐƠN #{b.bookingId}
                    </span>
                    {getStatusBadge(b.status)}
                  </div>

                  <h3 className="text-lg font-bold font-display text-white truncate">
                    {b.movieName}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-1.5 text-neutral-300 truncate">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{b.cinemaName || 'CinePrime Cinema'} - {b.roomName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>{b.startTime?.substring(0, 5) || b.startTime} · {b.showDate}</span>
                    </div>
                  </div>

                  {/* Seats information */}
                  <div className="text-xs font-mono">
                    <span className="text-neutral-400">Ghế: </span>
                    <span className="font-bold text-amber-400">
                      {b.tickets?.map((t) => t.seatCode).join(', ') || 'N/A'}
                    </span>
                    <span className="text-neutral-500 ml-1">
                      ({b.tickets?.length || 0} vé)
                    </span>
                  </div>

                  {/* Foods information */}
                  {b.foods && b.foods.length > 0 && (
                    <div className="text-xs font-mono text-neutral-400 line-clamp-1">
                      <span>🍿 Bắp nước: </span>
                      <span className="text-neutral-300">
                        {b.foods.map((f) => `${f.foodName} x${f.quantity}`).join(' · ')}
                      </span>
                    </div>
                  )}

                  {/* Real QR display snippet if paid */}
                  {b.status === 'PAID' && b.tickets?.[0]?.qrCode && (
                    <div className="pt-1 flex items-center gap-2">
                      <div className="w-8 h-8 p-0.5 bg-white rounded-md shrink-0 flex items-center justify-center">
                        <QRCodeSVG
                          value={b.tickets[0].qrCode}
                          size={28}
                          level="L"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400/90 truncate">
                        Check-in: {b.tickets[0].qrCode}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Column: Pricing & Action Buttons */}
                <div className="w-full md:w-auto shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-800">
                  <div className="md:text-right">
                    <span className="text-[11px] text-neutral-500 font-mono block">Tổng tiền</span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-amber-400">
                      {formatVND(b.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Digital Pass Modal */}
                    {b.status === 'PAID' && (
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem Vé Điện Tử</span>
                      </button>
                    )}

                    {/* Pending state: Pay Now & Cancel */}
                    {b.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate(`/payment/${b.bookingId}`)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Thanh Toán</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={cancellingId === b.bookingId}
                          onClick={() => handleCancelBooking(b.bookingId)}
                          className="p-2 rounded-xl text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
                          title="Hủy đơn đặt vé"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Ticket Pass Modal */}
      {selectedBooking && (
        <TicketPassModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};
