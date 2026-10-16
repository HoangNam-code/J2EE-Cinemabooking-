import React from 'react';
import { Check } from 'lucide-react';

export const SeatLegend = ({ basePrice = 75000 }) => {
  const formatPriceVND = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-300 font-mono">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-t-sm rounded-b-xs border border-neutral-600 bg-neutral-800/40" />
        <span>Thường ({formatPriceVND(basePrice)})</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-t-sm rounded-b-xs border border-purple-500/60 bg-purple-950/30 text-purple-300" />
        <span>VIP ({formatPriceVND(basePrice + 15000)})</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-4 rounded-t-sm rounded-b-xs border border-pink-500/60 bg-pink-950/30 text-pink-300" />
        <span>Couple ({formatPriceVND(basePrice * 2)})</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-t-sm rounded-b-xs border border-amber-400 bg-amber-400" />
        <span className="text-white font-medium">Đang chọn</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-t-sm rounded-b-xs border border-neutral-800 bg-neutral-800 opacity-40" />
        <span className="text-neutral-500">Đã bán / Giữ chỗ</span>
      </div>
    </div>
  );
};

export const SeatMap = ({ seats = [], selectedSeatIds = [], onToggleSeat }) => {
  // Group seats by rowName (A, B, C...)
  const rowGroups = React.useMemo(() => {
    const groups = {};
    seats.forEach((seat) => {
      const row = seat.rowName || (seat.seatCode ? seat.seatCode.charAt(0) : 'A');
      if (!groups[row]) {
        groups[row] = [];
      }
      groups[row].push(seat);
    });

    // Sort seats in each row by seatNumber or seatCode
    Object.keys(groups).forEach((row) => {
      groups[row].sort((a, b) => {
        const numA = a.seatNumber || parseInt(a.seatCode?.replace(/^[A-Z]/, '') || '0', 10);
        const numB = b.seatNumber || parseInt(b.seatCode?.replace(/^[A-Z]/, '') || '0', 10);
        return numA - numB;
      });
    });

    return groups;
  }, [seats]);

  const rows = Object.keys(rowGroups).sort();

  const getSeatStyle = (seat) => {
    const isSelected = selectedSeatIds.includes(seat.seatId);

    if (isSelected) {
      return 'bg-amber-400 text-neutral-950 font-bold border-amber-300 shadow-md scale-105 z-10';
    }

    const isOccupied =
      seat.status === 'BOOKED' ||
      seat.status === 'HOLD' ||
      seat.status === 'MAINTENANCE' ||
      seat.status === 'occupied';

    if (isOccupied) {
      return 'bg-neutral-800 text-neutral-600 border-neutral-800 cursor-not-allowed opacity-40';
    }

    const type = (seat.seatType || 'NORMAL').toUpperCase();
    switch (type) {
      case 'VIP':
        return 'border-purple-500/60 text-purple-300 bg-purple-950/30 hover:border-purple-400 hover:bg-purple-900/40';
      case 'COUPLE':
        return 'border-pink-500/60 text-pink-300 bg-pink-950/30 hover:border-pink-400 hover:bg-pink-900/40';
      case 'NORMAL':
      default:
        return 'border-neutral-600 bg-neutral-800/40 text-neutral-300 hover:border-neutral-400 hover:bg-neutral-700/60';
    }
  };

  const formatPriceVND = (price) => {
    if (!price && price !== 0) return '';
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-2">
      {/* Curved Screen Visualization with Amber Glow Gradient */}
      <div className="w-full flex flex-col items-center mb-8">
        <div className="w-3/4 max-w-xl h-2 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent rounded-full shadow-[0_0_25px_rgba(251,191,36,0.6)]" />
        <div className="w-4/5 max-w-2xl h-8 bg-gradient-to-b from-amber-500/10 to-transparent rounded-t-[100px] border-t border-amber-400/30 -mt-1 flex items-center justify-center">
          <span className="text-[10px] tracking-widest uppercase font-mono text-neutral-400">
            MÀN HÌNH CHIẾU CINEPRIME
          </span>
        </div>
      </div>

      {/* Seat Grid organized by rows */}
      {seats.length === 0 ? (
        <div className="p-8 text-center text-xs text-neutral-400 font-mono bg-neutral-950/40 rounded-xl border border-neutral-800 max-w-md">
          Chưa có sơ đồ ghế cho suất chiếu này. Vui lòng thử lại sau!
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-6 scrollbar-none flex justify-center">
          <div className="min-w-[680px] max-w-4xl mx-auto space-y-2.5">
            {rows.map((rowLetter) => (
              <div key={rowLetter} className="flex items-center justify-center gap-2">
                {/* Left Row Indicator */}
                <span className="w-6 text-center text-xs font-mono font-bold text-neutral-500 shrink-0">
                  {rowLetter}
                </span>

                {/* Seat Row */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {rowGroups[rowLetter].map((seat, index) => {
                    const isOccupied =
                      seat.status === 'BOOKED' ||
                      seat.status === 'HOLD' ||
                      seat.status === 'MAINTENANCE' ||
                      seat.status === 'occupied';

                    const isSelected = selectedSeatIds.includes(seat.seatId);
                    const isCouple = (seat.seatType || '').toUpperCase() === 'COUPLE';
                    // Aisle gap: tách lối đi đối xứng sau ghế thứ 2 và thứ 8 (cho hàng 10-12 ghế)
                    const isAisleRight = index === 1 || index === 7;

                    return (
                      <React.Fragment key={seat.seatId}>
                        <button
                          type="button"
                          onClick={() => onToggleSeat(seat)}
                          disabled={isOccupied}
                          title={`Ghế ${seat.seatCode} - ${seat.seatType} (${formatPriceVND(seat.price)})`}
                          className={`rounded-t-lg rounded-b-sm border text-[11px] font-mono flex items-center justify-center transition-all duration-150 cursor-pointer ${
                            isCouple ? 'w-14 sm:w-16 h-7 sm:h-8' : 'w-7 h-7 sm:w-8 sm:h-8'
                          } ${getSeatStyle(seat)}`}
                        >
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <span className="truncate px-0.5">{seat.seatCode}</span>
                          )}
                        </button>
                        {isAisleRight && <div className="w-3 sm:w-5" />}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Right Row Indicator */}
                <span className="w-6 text-center text-xs font-mono font-bold text-neutral-500 shrink-0">
                  {rowLetter}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
