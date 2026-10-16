import React, { useState } from 'react';
import { Film, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Cảm ơn bạn đã đăng ký nhận bản tin CinePrime!');
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#08090c] border-t border-neutral-800/80 mt-20 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: CinePrime Brand */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Film className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xl font-bold font-display tracking-wider text-white">
                CINEPRIME
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Tổ hợp rạp chiếu phim chuẩn quốc tế với công nghệ IMAX Laser, Dolby Atmos và dịch vụ Velvet Suites sang trọng hàng đầu Việt Nam.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400/90 pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hà Nội · TP. Hồ Chí Minh · Đà Nẵng</span>
            </div>
          </div>

          {/* Col 2: Hệ thống rạp */}
          <div className="space-y-3 font-mono text-[11px]">
            <span className="text-white font-semibold uppercase tracking-wider block font-sans text-xs">
              Hệ Thống Cụm Rạp
            </span>
            <div className="space-y-2 text-neutral-400">
              <div className="hover:text-white transition-colors cursor-pointer flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>CinePrime Grand Opera (Hà Nội)</span>
              </div>
              <div className="hover:text-white transition-colors cursor-pointer flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>CinePrime Landmark Saigon (TP.HCM)</span>
              </div>
              <div className="hover:text-white transition-colors cursor-pointer flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>CinePrime Riverside (Đà Nẵng)</span>
              </div>
              <div className="hover:text-white transition-colors cursor-pointer flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>CinePrime Westlake Center (Hà Nội)</span>
              </div>
            </div>
          </div>

          {/* Col 3: Chuẩn trình chiếu */}
          <div className="space-y-2.5 font-mono text-[11px]">
            <span className="text-white font-semibold uppercase tracking-wider block font-sans text-xs">
              Chuẩn Trình Chiếu
            </span>
            <div className="hover:text-neutral-200 transition-colors">IMAX Dual Laser 4K Cinema</div>
            <div className="hover:text-neutral-200 transition-colors">Dolby Vision & 128-Ch Atmos</div>
            <div className="hover:text-neutral-200 transition-colors">Panavision 70mm Celluloid 5-Perf</div>
            <div className="hover:text-neutral-200 transition-colors">Phòng Velvet Suites Hạng Thương Gia</div>
            <div className="hover:text-neutral-200 transition-colors">RealD 3D High Brightness</div>
          </div>

          {/* Col 4: Liên hệ & Đăng ký nhận tin */}
          <div className="space-y-3">
            <span className="text-white font-semibold uppercase tracking-wider block font-sans text-xs">
              Liên Hệ & Đặc Quyền
            </span>
            <div className="space-y-1.5 text-neutral-400 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">Hotline: 1900 6868 (8:00 - 23:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">concierge@cineprime.vn</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 pt-1">
              Đăng ký để nhận thông tin về suất chiếu sớm và ưu đãi thành viên.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 w-full"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-amber-400 text-neutral-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer text-xs"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} CinePrime Cinemas. Tất cả các quyền được bảo lưu.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
              Chính sách bảo mật
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
              Điều khoản dịch vụ
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
              Quy chế hoạt động
            </span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Đã đăng ký Bộ Công Thương</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
