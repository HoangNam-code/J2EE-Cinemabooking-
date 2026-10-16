import React from 'react';
import { Play, Ticket, Clock, Star, Volume2 } from 'lucide-react';
import { MovieImage } from '../movie/MovieImage';

export const HeroBanner = ({
  movie,
  showtimes = [],
  onBookNow,
  onPlayTrailer,
}) => {
  if (!movie) return null;

  const title = movie.movieName;
  const categoriesText = Array.isArray(movie.categories) ? movie.categories.join(' / ') : '';
  const firstShowtimes = (showtimes || []).slice(0, 4);

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 border-b border-neutral-800/80">
      {/* Background Media with rich scrim */}
      <div className="absolute inset-0 z-0">
        <MovieImage
          src={movie.posterUrl}
          alt={title}
          aspect="backdrop"
          className="w-full h-full object-cover scale-105 filter blur-[1px] brightness-75"
        />
        {/* Cinematic Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 flex flex-col justify-end min-h-[560px]">
        <div className="max-w-2xl space-y-4">
          {/* Metadata kicker */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-neutral-300 font-mono">
            <span className="text-amber-400 font-semibold tracking-wider uppercase">
              PHIM TIÊU ĐIỂM
            </span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span className="flex items-center gap-1 text-white">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>98% Đánh giá tích cực</span>
            </span>
            {movie.duration && (
              <>
                <span aria-hidden="true" className="text-neutral-500">·</span>
                <span className="flex items-center gap-1 text-neutral-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{movie.duration} phút</span>
                </span>
              </>
            )}
            {categoriesText && (
              <>
                <span aria-hidden="true" className="text-neutral-500">·</span>
                <span className="text-amber-300/90">{categoriesText}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-tight text-balance">
            {title}
          </h1>

          {/* Synopsis */}
          {movie.description && (
            <p className="text-base sm:text-lg text-neutral-300 line-clamp-3 leading-relaxed font-light">
              {movie.description}
            </p>
          )}

          {/* Formats and Tech Specs */}
          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono flex-wrap">
            <span className="flex items-center gap-1 text-amber-300/90">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dolby Atmos 128-Ch</span>
            </span>
            <span aria-hidden="true" className="text-neutral-600">/</span>
            <span>IMAX Laser Dual 4K</span>
            {movie.director && (
              <>
                <span aria-hidden="true" className="text-neutral-600">/</span>
                <span>Đạo diễn: {movie.director}</span>
              </>
            )}
          </div>

          {/* CTA Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onBookNow?.(firstShowtimes[0]?.showtimeId || movie.movieId)}
              className="px-6 py-3 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-lg active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Đặt Vé Ngay</span>
            </button>

            {movie.trailerUrl && (
              <button
                onClick={() => onPlayTrailer?.(movie)}
                className="px-5 py-3 text-sm font-medium text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-all backdrop-blur-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Xem Trailer</span>
              </button>
            )}
          </div>

          {/* Quick Showtime selection bar for today */}
          {firstShowtimes.length > 0 && (
            <div className="pt-4 border-t border-neutral-800/80">
              <div className="text-xs text-neutral-400 mb-2.5 font-medium flex items-center justify-between font-mono">
                <span>Suất chiếu hôm nay:</span>
                <span className="text-amber-400 text-[11px]">Chọn suất để đặt nhanh</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {firstShowtimes.map((st) => (
                  <button
                    key={st.showtimeId}
                    onClick={() => onBookNow?.(st.showtimeId)}
                    className="group px-3.5 py-2 bg-neutral-900/90 hover:bg-amber-400 border border-neutral-800 hover:border-amber-400 rounded-lg transition-all text-left cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-neutral-950 font-mono">
                      {st.startTime ? st.startTime.slice(0, 5) : '19:30'}
                    </div>
                    <div className="text-[10px] text-neutral-400 group-hover:text-neutral-900/80 tracking-tight font-mono">
                      {st.format || st.roomType || '2D Digital'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
