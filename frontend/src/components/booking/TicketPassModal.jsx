import React from 'react';
import { X, CheckCircle, Printer, Share2, Ticket, MapPin, Calendar, Clock, Film } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export const TicketPassModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Vé Phim CinePrime: ${booking.movieName}`,
      text: `Suất chiếu ${booking.movieName} tại ${booking.cinemaName} lúc ${booking.startTime} ngày ${booking.showDate}. Ghế: ${booking.tickets?.map((t) => t.seatCode).join(', ')}. Mã đơn: #${booking.bookingId}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `Vé CinePrime #${booking.bookingId}: ${booking.movieName} - Rạp: ${booking.cinemaName} - Suất: ${booking.startTime} ${booking.showDate} - Ghế: ${booking.tickets?.map((t) => t.seatCode).join(', ')}`
        );
        toast.success('Đã sao chép thông tin vé vào bộ nhớ tạm!');
      } catch (err) {
        toast.info(`Mã đơn đặt vé: #${booking.bookingId}`);
      }
    }
  };

  // Generate QR payload from tickets qrCode or fallback
  const firstQrCode = booking.tickets?.[0]?.qrCode || `CINEPRIME|ID:${booking.bookingId}|REF:${booking.bookingId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:bg-white print:p-0">
      <div className="relative w-full max-w-xl bg-[#0f1117] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Announcement Bar */}
        <div className="bg-emerald-950/80 border-b border-emerald-900/60 px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium font-mono">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Vé Xem Phim Điện Tử Hợp Lệ</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-emerald-400 hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital Boarding Pass Container */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Brand & Ref Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="text-lg font-bold font-display tracking-widest text-white">
                CINEPRIME PASS
              </span>
              <div className="text-[10px] text-amber-400 font-mono">
                THẺ VÀO PHÒNG CHIẾU ĐIỆN TỬ
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 font-mono block">
                MÃ ĐẶT VÉ
              </span>
              <span className="text-sm font-mono font-bold text-amber-400">
                #{booking.bookingId}
              </span>
            </div>
          </div>

          {/* Movie Title & Format */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span className="text-amber-400 font-bold uppercase">{booking.roomName || 'STANDARD'}</span>
              <span aria-hidden="true">·</span>
              <span>2D Digital</span>
              <span aria-hidden="true">·</span>
              <span>CinePrime Cinema</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              {booking.movieName}
            </h2>
          </div>

          {/* 4-Cell Matrix Grid: Rạp / Ngày / Suất chiếu / Ghế */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800/80 font-mono">
            <div>
              <div className="text-[10px] text-neutral-500 uppercase">Rạp chiếu</div>
              <div className="text-xs font-semibold text-white truncate" title={booking.cinemaName}>
                {booking.cinemaName || 'CinePrime'}
              </div>
              <div className="text-[10px] text-neutral-400 truncate">{booking.roomName}</div>
            </div>

            <div>
              <div className="text-[10px] text-neutral-500 uppercase">Ngày chiếu</div>
              <div className="text-xs font-semibold text-white">{booking.showDate}</div>
            </div>

            <div>
              <div className="text-[10px] text-neutral-500 uppercase">Suất chiếu</div>
              <div className="text-xs font-semibold text-amber-400">
                {booking.startTime?.substring(0, 5) || booking.startTime}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-neutral-500 uppercase">Vị trí ghế</div>
              <div className="text-xs font-bold text-amber-400">
                {booking.tickets?.map((s) => s.seatCode).join(', ') || 'N/A'}
              </div>
            </div>
          </div>

          {/* Concessions / Foods section if any */}
          {booking.foods && booking.foods.length > 0 && (
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs font-mono">
              <div className="text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
                <span>🍿 Combo Bắp Nước Kèm Theo:</span>
              </div>
              <div className="text-neutral-300">
                {booking.foods.map((f) => `${f.quantity}x ${f.foodName}`).join(' · ')}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Nhận bắp nước tại quầy Concessions trước giờ vào phòng chiếu.
              </div>
            </div>
          )}

          {/* Perforated Divider with Notch Cutouts */}
          <div className="relative my-4 flex items-center justify-between">
            <div className="w-5 h-8 bg-[#0b0c10] rounded-r-full -ml-8 border-y border-r border-neutral-800" />
            <div className="flex-1 border-t-2 border-dashed border-neutral-800 mx-2" />
            <div className="w-5 h-8 bg-[#0b0c10] rounded-l-full -mr-8 border-y border-l border-neutral-800" />
          </div>

          {/* Scannable Barcode & QR Code Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
            {/* Real QR Code using QRCodeSVG */}
            <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <QRCodeSVG
                value={firstQrCode}
                size={80}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Scan text & Barcode lines */}
            <div className="flex-1 text-center sm:text-left space-y-2 w-full">
              <div className="text-xs font-mono text-neutral-300">
                Mã QR: <span className="font-semibold text-white font-mono break-all">{firstQrCode}</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                Quét mã tại cửa kiểm soát hoặc máy soát vé tự động CinePrime
              </div>
              {/* Simulated barcode graphic (48 vertical bars) */}
              <div className="h-6 w-full flex items-center gap-[2px] opacity-70">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-white h-full ${
                      i % 3 === 0 ? 'w-[3px]' : i % 5 === 0 ? 'w-[1px]' : 'w-[2px]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In vé</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
