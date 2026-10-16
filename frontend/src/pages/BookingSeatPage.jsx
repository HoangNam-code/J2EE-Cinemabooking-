import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  RotateCw, 
  Film, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight,
  Armchair
} from 'lucide-react';
import { showtimeApi } from '../api';
import { SeatMap, SeatLegend } from '../components/booking/SeatMap';
import { useAuth } from '../store/AuthContext';

export const BookingSeatPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [seatMapData, setSeatMapData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSeatMap();
  }, [showtimeId]);

  const loadSeatMap = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const data = await showtimeApi.getSeatMap(showtimeId);
      setSeatMapData(data);
      if (isManual) {
        toast.success('Đã cập nhật lại sơ đồ ghế!');
      }
    } catch (err) {
      console.error('Error loading seat map:', err);
      toast.error(err.message || 'Không thể tải sơ đồ ghế');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleSeat = (seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.seatId === seat.seatId);
      if (exists) {
        return prev.filter((s) => s.seatId !== seat.seatId);
      } else {
        if (prev.length >= 8) {
          toast.warning('Mỗi giao dịch chỉ được chọn tối đa 8 ghế!');
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const formatPriceVND = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0) + ' ₫';
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  const handleProceed = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập trước khi tiến hành chọn vé!');
      return navigate('/login');
    }

    if (selectedSeats.length === 0) {
      toast.warning('Vui lòng chọn ít nhất 1 ghế trước khi tiếp tục!');
      return;
    }

    // Save selection in sessionStorage
    sessionStorage.setItem('booking_showtimeId', showtimeId);
    sessionStorage.setItem('booking_seats', JSON.stringify(selectedSeats));
    sessionStorage.setItem(
      'booking_metadata',
      JSON.stringify({
        cinemaName: seatMapData?.cinemaName,
        roomName: seatMapData?.roomName,
        roomType: seatMapData?.roomType,
      })
    );

    navigate('/booking/combo');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-neutral-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 font-mono text-sm text-neutral-400">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p>Đang chuẩn bị sơ đồ phòng chiếu...</p>
        </div>
      </div>
    );
  }

  if (!seatMapData) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-neutral-100 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <Film className="w-16 h-16 text-neutral-600 mx-auto" />
          <h2 className="text-2xl font-bold font-display text-white">Không tải được sơ đồ ghế</h2>
          <p className="text-sm text-neutral-400">
            Suất chiếu không tồn tại hoặc dữ liệu phòng chiếu tạm thời không khả dụng.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 pb-32">
      {/* Top info bar */}
      <div className="border-b border-neutral-800 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg border border-neutral-800 transition-colors cursor-pointer shrink-0 mt-0.5 sm:mt-0"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider flex-wrap">
                <span className="font-bold">{seatMapData.roomType || '2D Digital'}</span>
                <span className="text-neutral-600">·</span>
                <span className="text-neutral-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-neutral-500" />
                  {seatMapData.cinemaName}
                </span>
                <span className="text-neutral-600">·</span>
                <span className="text-neutral-300 flex items-center gap-1">
                  <Armchair className="w-3 h-3 text-neutral-500" />
                  {seatMapData.roomName}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                Bước 1: Chọn Ghế Ngồi
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="text-xs font-mono text-neutral-400 hidden lg:block text-right">
              Tối đa 8 ghế / giao dịch
            </div>
            <button
              onClick={() => loadSeatMap(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-neutral-800 text-xs font-mono transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{refreshing ? 'Đang tải...' : 'Làm mới sơ đồ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Seat Map Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-4 sm:p-8 shadow-2xl space-y-6">
          {/* Seat Map Visualization */}
          <SeatMap
            seats={seatMapData.seats || []}
            selectedSeatIds={selectedSeats.map((s) => s.seatId)}
            onToggleSeat={handleToggleSeat}
          />

          {/* Seat Type Legend Panel */}
          <SeatLegend basePrice={seatMapData.basePrice || 75000} />
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f1117]/95 border-t border-neutral-800 backdrop-blur-lg px-4 sm:px-6 py-3.5 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Selected seats info */}
          <div className="space-y-1 w-full sm:w-auto text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-xs font-mono text-neutral-400">
                Đã chọn ({selectedSeats.length}/8):
              </span>
              {selectedSeats.length === 0 ? (
                <span className="text-xs text-neutral-500 italic">Vui lòng bấm chọn ghế trên sơ đồ</span>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-12 overflow-y-auto">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.seatId}
                      className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40"
                    >
                      {s.seatCode}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {selectedSeats.length > 0 && (
              <div className="text-xs text-neutral-400 font-mono">
                Tổng tiền ghế:{' '}
                <span className="text-amber-400 text-base font-bold">
                  {formatPriceVND(totalPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                selectedSeats.length > 0
                  ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 scale-100 hover:scale-102'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'
              }`}
            >
              <span>Tiếp tục chọn bắp nước</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
