import React from 'react';
import { Eye, Film, Volume2 } from 'lucide-react';

export const FormatsShowcase = () => {
  return (
    <section id="formats" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
          CÔNG NGHỆ ĐIỆN ẢNH TIÊN TIẾN
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
          Chuẩn Trình Chiếu Đẳng Cấp
        </h2>
        <p className="text-sm text-neutral-400 max-w-2xl mt-1">
          Hệ thống phòng chiếu tại CinePrime được đầu tư đồng bộ thiết bị âm thanh và hình ảnh cao cấp nhất thế giới hiện nay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: IMAX Laser */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 hover:border-neutral-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white">IMAX Dual 4K Laser</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Hệ thống máy chiếu kép Laser 4K thương mại thế hệ mới, mang lại độ sáng vượt trội, sắc đen sâu thẳm cùng tỷ lệ khung hình mở rộng 1.43:1 bao trùm toàn bộ thị giác.
          </p>
          <div className="border-t border-neutral-800 pt-3 text-[11px] font-mono text-neutral-500 space-y-1">
            <div>· Tỷ lệ khung hình điện ảnh 1.43:1</div>
            <div>· Hệ thống âm thanh laser 12 kênh cân chỉnh riêng</div>
            <div>· Màn chiếu bạc cong phủ tinh thể độc quyền</div>
          </div>
        </div>

        {/* Card 2: 70mm Celluloid / Film */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 hover:border-neutral-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white">70mm Panavision Film</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Trình chiếu phim nhựa 70mm quang hóa quý hiếm với tốc độ chuẩn 24 khung hình/giây. Mang lại chất màu điện ảnh ấm áp hữu cơ và độ phân giải quang học đỉnh cao.
          </p>
          <div className="border-t border-neutral-800 pt-3 text-[11px] font-mono text-neutral-500 space-y-1">
            <div>· Độ phân giải tương đương ~18K quang học</div>
            <div>· Chuyên gia chiếu phim analog được cấp chứng chỉ</div>
            <div>· Bản in nhựa 5-perf & 15-perf lưu trữ bảo tàng</div>
          </div>
        </div>

        {/* Card 3: Dolby Cinema & Atmos */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 hover:border-neutral-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Volume2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white">Dolby Cinema & Atmos</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Công nghệ hình ảnh Dolby Vision HDR với độ tương phản 1.000.000:1 kết hợp âm thanh vòm Dolby Atmos di chuyển chân thực trong không gian 3 chiều xung quanh bạn.
          </p>
          <div className="border-t border-neutral-800 pt-3 text-[11px] font-mono text-neutral-500 space-y-1">
            <div>· 64 loa cách âm trường âm học độc lập</div>
            <div>· Phòng chiếu bọc nhung triệt tiêu phản xạ ánh sáng</div>
            <div>· Bộ rung siêu trầm tích hợp trực tiếp vào từng ghế</div>
          </div>
        </div>
      </div>
    </section>
  );
};
