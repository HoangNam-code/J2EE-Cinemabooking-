import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  UtensilsCrossed,
  Wrench,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  SlidersHorizontal,
  Package,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { staffApi } from '../api';
import { useAuth } from '../store/AuthContext';
import { MovieImage } from '../components/common/MovieImage';

export const StaffTicketScannerPage = () => {
  const { user } = useAuth();
  
  // Navigation tabs: 'scanner' | 'foods' | 'seats'
  const [activeTab, setActiveTab] = useState('scanner');

  // ==========================================
  // TAB 1: SOÁT VÉ QR STATE
  // ==========================================
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);

  // ==========================================
  // TAB 2: KHO BẮP NƯỚC STATE
  // ==========================================
  const [foods, setFoods] = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [togglingFoodId, setTogglingFoodId] = useState(null);

  // ==========================================
  // TAB 3: KHÓA GHẾ BẢO TRÌ STATE
  // ==========================================
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [roomSeats, setRoomSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [togglingSeatId, setTogglingSeatId] = useState(null);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'foods') {
      loadStaffFoods();
    } else if (activeTab === 'seats') {
      loadStaffRooms();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedRoomId) {
      loadRoomSeats(selectedRoomId);
    }
  }, [selectedRoomId]);

  // ==========================================
  // 1. SOÁT VÉ LOGIC
  // ==========================================
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

  // ==========================================
  // 2. KHO BẮP NƯỚC LOGIC
  // ==========================================
  const loadStaffFoods = async () => {
    try {
      setFoodsLoading(true);
      const data = await staffApi.getFoods();
      setFoods(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Không thể tải danh sách bắp nước: ' + err.message);
    } finally {
      setFoodsLoading(false);
    }
  };

  const handleToggleFood = async (food) => {
    try {
      setTogglingFoodId(food.foodId);
      const res = await staffApi.toggleFoodStatus(food.foodId);
      const updatedFood = res.data || res;
      setFoods((prev) =>
        prev.map((f) => (f.foodId === food.foodId ? { ...f, status: updatedFood.status } : f))
      );
      if (updatedFood.status === 'ACTIVE') {
        toast.success(`Đã mở bán lại món: ${food.foodName}`);
      } else {
        toast.warning(`Đã chuyển sang hết hàng: ${food.foodName}`);
      }
    } catch (err) {
      toast.error('Cập nhật trạng thái bắp nước thất bại: ' + err.message);
    } finally {
      setTogglingFoodId(null);
    }
  };

  // ==========================================
  // 3. KHÓA GHẾ BẢO TRÌ LOGIC
  // ==========================================
  const loadStaffRooms = async () => {
    try {
      setSeatsLoading(true);
      const data = await staffApi.getRooms();
      const roomList = Array.isArray(data) ? data : [];
      setRooms(roomList);
      if (roomList.length > 0 && !selectedRoomId) {
        setSelectedRoomId(roomList[0].roomId);
      }
    } catch (err) {
      toast.error('Không thể tải danh sách phòng chiếu: ' + err.message);
    } finally {
      setSeatsLoading(false);
    }
  };

  const loadRoomSeats = async (roomId) => {
    try {
      setSeatsLoading(true);
      const data = await staffApi.getRoomSeats(roomId);
      setRoomSeats(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Không thể tải sơ đồ ghế: ' + err.message);
    } finally {
      setSeatsLoading(false);
    }
  };

  const handleToggleSeatMaintenance = async (seat) => {
    const isMaintenance = seat.status === 'MAINTENANCE';
    const actionText = isMaintenance ? 'mở khóa phục vụ lại' : 'khóa bảo trì/hỏng';

    try {
      setTogglingSeatId(seat.seatId);
      const res = await staffApi.toggleSeatMaintenance(seat.seatId);
      const updatedSeat = res.data || res;
      
      setRoomSeats((prev) =>
        prev.map((s) => (s.seatId === seat.seatId ? { ...s, status: updatedSeat.status } : s))
      );

      // Cập nhật lại số lượng maintenance trên list rooms
      setRooms((prev) =>
        prev.map((r) => {
          if (r.roomId === selectedRoomId) {
            const diff = updatedSeat.status === 'MAINTENANCE' ? 1 : -1;
            return { ...r, maintenanceSeats: Math.max(0, (r.maintenanceSeats || 0) + diff) };
          }
          return r;
        })
      );

      if (updatedSeat.status === 'MAINTENANCE') {
        toast.warning(`Đã khóa ghế ${seat.seatCode} (Bảo trì/Hỏng)`);
      } else {
        toast.success(`Đã mở khóa ghế ${seat.seatCode} (Sẵn sàng phục vụ)`);
      }
    } catch (err) {
      toast.error(`Thất bại khi ${actionText} ghế: ` + err.message);
    } finally {
      setTogglingSeatId(null);
    }
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0) + ' ₫';
  };

  // Group seats by row for layout rendering
  const seatRows = React.useMemo(() => {
    const groups = {};
    roomSeats.forEach((seat) => {
      const row = seat.rowName || (seat.seatCode ? seat.seatCode.charAt(0) : 'A');
      if (!groups[row]) groups[row] = [];
      groups[row].push(seat);
    });
    Object.keys(groups).forEach((row) => {
      groups[row].sort((a, b) => (a.seatNumber || 0) - (b.seatNumber || 0));
    });
    return groups;
  }, [roomSeats]);

  const sortedRowKeys = Object.keys(seatRows).sort();

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ==========================================
            CONSOLE TOP HEADER
        ========================================== */}
        <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-mono font-bold mb-3">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>CINEPRIME STAFF CONSOLE &bull; VẬN HÀNH RẠP</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                Bàn Làm Việc Nhân Viên
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Quản lý các tác vụ thực thi hàng ngày tại cụm rạp: Soát vé QR, kho bắp nước và bảo trì ghế
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold font-mono">
                {user?.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-snug">{user?.fullName || user?.username}</p>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase tracking-wider">
                  Vai trò: {user?.role || 'STAFF'} (Nhân Viên Rạp)
                </span>
              </div>
            </div>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6 pt-6 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>1. Cổng Soát Vé QR</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('foods')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'foods'
                  ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>2. Quản Lý Kho Bắp Nước</span>
              {foods.some((f) => f.status === 'INACTIVE') && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono">
                  Hết hàng
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seats')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'seats'
                  ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <Armchair className="w-4 h-4" />
              <span>3. Khóa Ghế Bảo Trì / Hỏng</span>
              {rooms.reduce((acc, r) => acc + (r.maintenanceSeats || 0), 0) > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-mono font-bold">
                  {rooms.reduce((acc, r) => acc + (r.maintenanceSeats || 0), 0)} đang khóa
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ==========================================
            TAB 1: CỔNG SOÁT VÉ QR
        ========================================== */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                <span>Quét Mã Soát Vé Khách Vào Cửa</span>
              </h2>
              <p className="text-xs text-neutral-400 mb-6">
                Nhập hoặc quét mã QR trên vé của khách để kiểm tra tính hợp lệ trước khi cho vào phòng chiếu
              </p>

              <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nhập mã QR Code (VD: TICKET-...) hoặc Mã đơn (VD: BK-1791...)"
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

            {/* Ticket Info Card */}
            {ticketInfo && (
              <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in space-y-6">
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
        )}

        {/* ==========================================
            TAB 2: QUẢN LÝ KHO BẮP NƯỚC TẠI RẠP
        ========================================== */}
        {activeTab === 'foods' && (
          <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                  <span>Kho Bắp Nước & Căng Tin Rạp</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Nhân viên có thể bật / tắt trạng thái Hết hàng khi quầy rạp hết bắp hoặc đồ uống
                </p>
              </div>

              <button
                type="button"
                onClick={loadStaffFoods}
                disabled={foodsLoading}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${foodsLoading ? 'animate-spin' : ''}`} />
                <span>Làm mới danh sách</span>
              </button>
            </div>

            {foodsLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-neutral-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                <span className="text-xs font-mono">Đang tải danh sách bắp nước...</span>
              </div>
            ) : foods.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-sm">
                Không tìm thấy món ăn/uống nào trong hệ thống.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {foods.map((food) => {
                  const isActive = food.status === 'ACTIVE';
                  const isUpdating = togglingFoodId === food.foodId;

                  return (
                    <div
                      key={food.foodId}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                          : 'bg-rose-950/10 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/60 flex items-center justify-center">
                          {food.imageUrl ? (
                            <img
                              src={food.imageUrl}
                              alt={food.foodName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UtensilsCrossed className="w-6 h-6 text-neutral-500" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{food.foodName}</h4>
                          <p className="text-xs text-neutral-400 line-clamp-1">{food.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono font-bold text-amber-400">
                              {formatVND(food.price)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                                isActive
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {isActive ? 'Còn hàng' : 'Hết hàng tại rạp'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Toggle button */}
                      <button
                        type="button"
                        onClick={() => handleToggleFood(food)}
                        disabled={isUpdating}
                        className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                          isActive
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isActive ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Báo Hết Hàng</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mở Bán Lại</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 3: KHÓA GHẾ PHÒNG CHIẾU (BẢO TRÌ / HỎNG)
        ========================================== */}
        {activeTab === 'seats' && (
          <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Armchair className="w-5 h-5 text-amber-400" />
                  <span>Quản Lý & Khóa Ghế Phòng Chiếu</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Nhân viên có thể nhấp vào bất kỳ ghế nào để khóa (đưa vào bảo trì/hỏng) hoặc mở lại phục vụ khách
                </p>
              </div>

              {/* Room selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-400 whitespace-nowrap">Chọn phòng:</span>
                <select
                  value={selectedRoomId || ''}
                  onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                  className="bg-neutral-900 border border-neutral-700 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {rooms.map((r) => (
                    <option key={r.roomId} value={r.roomId}>
                      {r.roomName} ({r.roomType}) - {r.maintenanceSeats > 0 ? `⚠️ ${r.maintenanceSeats} ghế khóa` : '✓ Bình thường'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Room stats badge */}
            {selectedRoomId && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Tổng số ghế</span>
                  <span className="text-base font-bold text-white font-mono">{roomSeats.length}</span>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase block">Sẵn sàng bán</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {roomSeats.filter((s) => s.status === 'ACTIVE').length}
                  </span>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-mono text-rose-400 uppercase block">Đang bảo trì/hỏng</span>
                  <span className="text-base font-bold text-rose-400 font-mono">
                    {roomSeats.filter((s) => s.status === 'MAINTENANCE').length}
                  </span>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-mono text-purple-400 uppercase block">Ghế VIP / Couple</span>
                  <span className="text-base font-bold text-purple-400 font-mono">
                    {roomSeats.filter((s) => s.seatType === 'VIP' || s.seatType === 'COUPLE').length}
                  </span>
                </div>
              </div>
            )}

            {/* Seat layout */}
            {seatsLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-neutral-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                <span className="text-xs font-mono">Đang tải sơ đồ ghế phòng chiếu...</span>
              </div>
            ) : roomSeats.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-sm">
                Phòng này chưa có dữ liệu sơ đồ ghế.
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {/* Cinema Screen Mockup */}
                <div className="w-full max-w-xl mx-auto flex flex-col items-center">
                  <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 mt-2">
                    Màn Hình Chiếu
                  </span>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono pt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-neutral-800 border border-neutral-600" />
                    <span className="text-neutral-400">Thường</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-purple-950/60 border border-purple-500/60" />
                    <span className="text-purple-300">VIP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-4 rounded bg-pink-950/60 border border-pink-500/60" />
                    <span className="text-pink-300">Couple</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-rose-950 border border-rose-500 flex items-center justify-center text-[10px] text-rose-300 font-bold">
                      ✕
                    </div>
                    <span className="text-rose-400 font-semibold">Đang Khóa / Bảo Trì (Click để mở)</span>
                  </div>
                </div>

                {/* Seat Matrix */}
                <div className="overflow-x-auto pb-4">
                  <div className="inline-flex flex-col items-center min-w-full space-y-2">
                    {sortedRowKeys.map((row) => (
                      <div key={row} className="flex items-center gap-2">
                        <span className="w-6 text-center text-xs font-mono font-bold text-neutral-500 shrink-0">
                          {row}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {seatRows[row].map((seat, idx) => {
                            const isMaintenance = seat.status === 'MAINTENANCE';
                            const isCouple = seat.seatType === 'COUPLE';
                            const isUpdating = togglingSeatId === seat.seatId;

                            // Color styling
                            let style = 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:border-amber-400';
                            if (isMaintenance) {
                              style = 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-lg shadow-rose-950/50 scale-102';
                            } else if (seat.seatType === 'VIP') {
                              style = 'bg-purple-950/50 border-purple-500/50 text-purple-300 hover:border-purple-400';
                            } else if (seat.seatType === 'COUPLE') {
                              style = 'bg-pink-950/50 border-pink-500/50 text-pink-300 hover:border-pink-400';
                            }

                            const isAisle = idx === 1 || idx === 7;

                            return (
                              <React.Fragment key={seat.seatId}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleSeatMaintenance(seat)}
                                  disabled={isUpdating}
                                  title={`Ghế ${seat.seatCode} (${seat.seatType}) - Trạng thái: ${
                                    isMaintenance ? 'BẢO TRÌ/HỎNG (Bấm để mở lại)' : 'HOẠT ĐỘNG (Bấm để khóa)'
                                  }`}
                                  className={`rounded-t-lg rounded-b-sm border text-[11px] font-mono flex items-center justify-center transition-all cursor-pointer ${
                                    isCouple ? 'w-14 h-7' : 'w-7 h-7'
                                  } ${style}`}
                                >
                                  {isUpdating ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                                  ) : isMaintenance ? (
                                    <span className="text-[10px] font-bold text-rose-300">✕</span>
                                  ) : (
                                    <span className="truncate px-0.5">{seat.seatCode}</span>
                                  )}
                                </button>
                                {isAisle && <div className="w-3" />}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        <span className="w-6 text-center text-xs font-mono font-bold text-neutral-500 shrink-0">
                          {row}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-400 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Hướng dẫn thao tác bảo trì:</span>
                    Nhấp chuột trực tiếp vào ô ghế bất kỳ để chuyển đổi qua lại giữa <strong className="text-emerald-400">Hoạt động bình thường</strong> và <strong className="text-rose-400">Khóa bảo trì</strong>. Các ghế bị khóa bảo trì sẽ lập tức hiển thị màu xám mờ trên sơ đồ khách đặt và hệ thống Backend sẽ từ chối giao dịch nếu khách cố tình đặt ghế này.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffTicketScannerPage;
