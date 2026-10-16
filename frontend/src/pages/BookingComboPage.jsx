import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ChevronRight, 
  Film, 
  UtensilsCrossed, 
  Ticket, 
  Tag, 
  Check, 
  Clock, 
  MapPin, 
  Armchair 
} from 'lucide-react';
import { foodApi, bookingApi } from '../api';
import { MovieImage } from '../components/common/MovieImage';

export const BookingComboPage = () => {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Read stored data
  const showtimeId = sessionStorage.getItem('booking_showtimeId');
  const storedSeats = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('booking_seats') || '[]');
    } catch {
      return [];
    }
  }, []);

  const metadata = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('booking_metadata') || '{}');
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    if (!showtimeId || storedSeats.length === 0) {
      toast.error('Không tìm thấy thông tin ghế đã chọn. Vui lòng chọn ghế trước!');
      navigate('/');
      return;
    }
    loadFoods();
  }, [showtimeId, storedSeats, navigate]);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const data = await foodApi.getAll();
      setFoods(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading foods:', err);
      toast.error('Không thể tải thực đơn bắp nước');
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Tất cả', 'Bắp & Đồ Ăn', 'Thức Uống', 'Combo'];

  const filteredFoods = useMemo(() => {
    if (activeCategory === 'Tất cả') return foods;
    const catLower = activeCategory.toLowerCase();

    return foods.filter((f) => {
      const name = (f.foodName || '').toLowerCase();
      const desc = (f.description || '').toLowerCase();
      const type = (f.foodType || f.category || '').toLowerCase();

      if (activeCategory === 'Combo') {
        return name.includes('combo') || desc.includes('combo') || type.includes('combo');
      }
      if (activeCategory === 'Thức Uống') {
        return (
          name.includes('nước') ||
          name.includes('pepsi') ||
          name.includes('coke') ||
          name.includes('trà') ||
          name.includes('suối') ||
          type.includes('drink') ||
          type.includes('beverage')
        );
      }
      if (activeCategory === 'Bắp & Đồ Ăn') {
        return (
          name.includes('bắp') ||
          name.includes('snack') ||
          name.includes('khoai') ||
          name.includes('xúc xích') ||
          type.includes('snack') ||
          type.includes('popcorn')
        );
      }
      return true;
    });
  }, [foods, activeCategory]);

  const updateQuantity = (foodId, delta) => {
    setQuantities((prev) => {
      const current = prev[foodId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[foodId];
        return copy;
      }
      return { ...prev, [foodId]: next };
    });
  };

  const formatPriceVND = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0) + ' ₫';
  };

  const ticketSubtotal = useMemo(() => {
    return storedSeats.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  }, [storedSeats]);

  const foodSubtotal = useMemo(() => {
    return foods.reduce((sum, f) => {
      const q = quantities[f.foodId] || 0;
      return sum + q * (Number(f.price) || 0);
    }, 0);
  }, [foods, quantities]);

  const totalBeforeDiscount = ticketSubtotal + foodSubtotal;
  const finalTotal = Math.max(0, totalBeforeDiscount - discountAmount);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      toast.warning('Vui lòng nhập mã khuyến mãi!');
      return;
    }

    if (code === 'WELCOME10') {
      const discount = Math.round(totalBeforeDiscount * 0.1);
      setDiscountAmount(discount);
      setAppliedPromo(code);
      toast.success(`Đã áp dụng mã WELCOME10 (-10%): giảm ${formatPriceVND(discount)}!`);
    } else if (code === 'CINE50K') {
      const discount = Math.min(50000, totalBeforeDiscount);
      setDiscountAmount(discount);
      setAppliedPromo(code);
      toast.success(`Đã áp dụng mã CINE50K: giảm ${formatPriceVND(discount)}!`);
    } else {
      // Allow code to be sent to backend validation
      setAppliedPromo(code);
      toast.info(`Mã voucher ${code} sẽ được kiểm tra khi tạo giữ chỗ`);
    }
  };

  const handleCreateBooking = async (skipFoods = false) => {
    try {
      setSubmitting(true);

      const foodPayload = skipFoods
        ? []
        : Object.entries(quantities)
            .filter(([_, q]) => q > 0)
            .map(([id, q]) => ({ foodId: Number(id), quantity: q }));

      const payload = {
        showtimeId: Number(showtimeId),
        seatIds: storedSeats.map((s) => s.seatId),
        foods: foodPayload,
        promotionCode: appliedPromo || (promoCode.trim() ? promoCode.trim().toUpperCase() : null),
      };

      const result = await bookingApi.createHold(payload);

      toast.success('Giữ chỗ thành công! Đang chuyển đến trang thanh toán...');

      // Clear session holding data
      sessionStorage.removeItem('booking_showtimeId');
      sessionStorage.removeItem('booking_seats');
      sessionStorage.removeItem('booking_metadata');

      navigate(`/payment/${result.bookingId}`);
    } catch (err) {
      console.error('Create booking failed:', err);
      toast.error(err.message || 'Không thể tạo đơn giữ vé. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-neutral-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 font-mono text-sm text-neutral-400">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p>Đang chuẩn bị thực đơn bắp nước...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 pb-20">
      {/* Top Header Bar */}
      <div className="border-b border-neutral-800 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg border border-neutral-800 transition-colors cursor-pointer"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                BƯỚC 2: BẮP NƯỚC & KHUYẾN MÃI
              </span>
              <h1 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                CinePrime Gourmet & Refreshments
              </h1>
            </div>
          </div>

          <div className="text-xs font-mono text-neutral-400 hidden sm:block">
            {storedSeats.length} vé đã chọn
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Food Categories & Grid (8 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-mono font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                    activeCategory === cat
                      ? 'bg-amber-400 border-amber-400 text-neutral-950 font-bold shadow-md'
                      : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Foods Grid (2 cols on lg, 1 on mobile) */}
            {filteredFoods.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-neutral-400 bg-neutral-950/40 rounded-xl border border-neutral-800 space-y-2">
                <UtensilsCrossed className="w-8 h-8 text-neutral-600 mx-auto" />
                <p>Không có sản phẩm nào thuộc phân loại này.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredFoods.map((food) => {
                  const qty = quantities[food.foodId] || 0;
                  return (
                    <div
                      key={food.foodId}
                      className="flex gap-3.5 p-3.5 bg-[#0f1117] border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all shadow-md group"
                    >
                      {/* Food image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-neutral-950 relative border border-neutral-800/80">
                        <MovieImage
                          src={food.imageUrl || 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=200'}
                          alt={food.foodName}
                          aspect="square"
                          fallbackTitle={food.foodName}
                          fallbackGenre="Gourmet"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1 group-hover:text-amber-400 transition-colors">
                              {food.foodName}
                            </h3>
                          </div>
                          <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                            {food.description || 'Thơm ngon, chuẩn vị rạp chiếu CinePrime.'}
                          </p>
                          <div className="text-xs font-mono font-bold text-amber-400 mt-1.5">
                            {formatPriceVND(food.price)}
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center justify-end gap-2 pt-2">
                          {qty > 0 ? (
                            <div className="flex items-center bg-neutral-850 rounded-lg p-0.5 border border-neutral-750 font-mono">
                              <button
                                type="button"
                                onClick={() => updateQuantity(food.foodId, -1)}
                                className="w-6 h-6 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-mono font-bold text-white">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(food.foodId, 1)}
                                className="w-6 h-6 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateQuantity(food.foodId, 1)}
                              className="px-3 py-1.5 text-xs font-mono font-medium text-neutral-200 bg-neutral-900 hover:bg-amber-400 hover:text-neutral-950 rounded-lg transition-colors border border-neutral-800 hover:border-amber-400 cursor-pointer"
                            >
                              + Thêm
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Order Summary & Voucher (4 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
              <h2 className="text-base sm:text-lg font-bold font-display text-white border-b border-neutral-800 pb-3 flex items-center justify-between">
                <span>Tóm Tắt Đơn Vé</span>
                <span className="text-xs font-mono text-amber-400 font-normal">CinePrime</span>
              </h2>

              {/* Theater & Room info */}
              {(metadata.cinemaName || metadata.roomName) && (
                <div className="space-y-1 text-xs font-mono text-neutral-400 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
                  {metadata.cinemaName && (
                    <div className="flex items-center gap-1.5 text-neutral-200">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-semibold">{metadata.cinemaName}</span>
                    </div>
                  )}
                  {metadata.roomName && (
                    <div className="flex items-center gap-1.5 pl-5">
                      <span>Phòng: {metadata.roomName}</span>
                      {metadata.roomType && <span>({metadata.roomType})</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Selected seats list with prices */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>Vé ghế ({storedSeats.length}):</span>
                  </span>
                  <span className="text-white font-semibold">{formatPriceVND(ticketSubtotal)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {storedSeats.map((s) => (
                    <span
                      key={s.seatId}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-300"
                    >
                      {s.seatCode} ({formatPriceVND(s.price)})
                    </span>
                  ))}
                </div>
              </div>

              {/* Selected foods list with prices */}
              {foodSubtotal > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-800/60">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                      <span>Bắp nước:</span>
                    </span>
                    <span className="text-white font-semibold">{formatPriceVND(foodSubtotal)}</span>
                  </div>
                  <div className="space-y-1 pl-5">
                    {Object.entries(quantities)
                      .filter(([_, q]) => q > 0)
                      .map(([id, q]) => {
                        const foodItem = foods.find((f) => f.foodId === Number(id));
                        if (!foodItem) return null;
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between text-[11px] font-mono text-neutral-400"
                          >
                            <span>
                              {foodItem.foodName} x{q}
                            </span>
                            <span className="text-neutral-300">
                              {formatPriceVND(foodItem.price * q)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Promotion Code Input */}
              <div className="space-y-2 pt-2 border-t border-neutral-800/60">
                <label className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mã khuyến mãi:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="VD: WELCOME10, CINE50K"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-neutral-600 uppercase focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-800 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Áp dụng
                  </button>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 pt-1">
                    <span>Khuyến mãi ({appliedPromo}):</span>
                    <span>-{formatPriceVND(discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Total calculation */}
              <div className="pt-3 border-t border-neutral-800 space-y-1">
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-sm font-semibold text-neutral-300">Tổng thanh toán:</span>
                  <span className="text-xl font-bold font-mono text-amber-400">
                    {formatPriceVND(finalTotal)}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 font-mono">
                  * Vé được giữ trong 10 phút sau khi xác nhận.
                </p>
              </div>

              {/* Submission buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleCreateBooking(false)}
                  disabled={submitting}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{submitting ? 'Đang giữ ghế...' : 'Hoàn tất đặt vé'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCreateBooking(true)}
                  disabled={submitting}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white font-mono text-xs rounded-xl border border-neutral-800 transition-colors cursor-pointer text-center"
                >
                  Bỏ qua bắp nước & Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
