import React, { useRef } from 'react';
import { Sparkles, Calendar, Play, ChevronLeft, ChevronRight, Info, Clock, Star } from 'lucide-react';
import { MovieImage } from '../common/MovieImage';

export const ComingSoonSpotlight = ({ movies = [], onOpenDetails, onPlayTrailer }) => {
  const scrollContainerRef = useRef(null);

  if (!movies || movies.length === 0) return null;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="coming-soon" className="relative py-10 bg-gradient-to-b from-[#0e1017] via-[#0b0c10] to-[#0b0c10] border-b border-neutral-800/80 overflow-hidden">
      {/* Decorative ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section with badge & scroll buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/15 to-purple-500/15 border border-pink-500/30 text-pink-400 text-xs font-mono font-bold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>Sắp Khởi Chiếu • Bom Tấn Sắp Đổ Bộ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-white tracking-tight">
              Phim Sắp Chiếu Tại CinePrime
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Đón đầu những siêu phẩm điện ảnh đỉnh cao chuẩn bị ra mắt tại các phòng chiếu IMAX & Dolby Atmos
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-mono text-neutral-400 mr-2 hidden sm:inline-block">
              {movies.length} siêu phẩm
            </span>
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-pink-500/40 text-neutral-300 hover:text-white transition-all cursor-pointer hover:bg-neutral-800 active:scale-95 shadow-md"
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-pink-500/40 text-neutral-300 hover:text-white transition-all cursor-pointer hover:bg-neutral-800 active:scale-95 shadow-md"
              aria-label="Cuộn sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Spotlight Reel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => {
            const categories = Array.isArray(movie.categories) ? movie.categories : [];
            const primaryCat = categories[0] || 'Bom tấn';

            return (
              <div
                key={movie.movieId}
                onClick={() => onOpenDetails?.(movie)}
                className="group relative flex-none w-[260px] sm:w-[280px] bg-gradient-to-b from-[#13161f] to-[#0c0d12] border border-neutral-800 rounded-2xl overflow-hidden hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 cursor-pointer snap-start flex flex-col justify-between"
              >
                {/* Poster Wrapper with Badge */}
                <div className="relative aspect-[2/3] overflow-hidden bg-neutral-950">
                  <MovieImage
                    src={movie.posterUrl}
                    alt={movie.movieName}
                    aspect="poster"
                    fallbackTitle={movie.movieName}
                    fallbackGenre={primaryCat}
                    className="group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13161f] via-transparent to-black/30" />

                  {/* Top-left Release Date Tag */}
                  <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-pink-500/40 text-[11px] font-mono font-bold text-pink-300 shadow-lg flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>{movie.releaseDate ? `Khởi chiếu ${movie.releaseDate}` : 'Sắp ra mắt'}</span>
                  </div>

                  {/* Top-right Age Rating or Format */}
                  <div className="absolute top-3 right-3 bg-amber-400/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    IMAX LASER
                  </div>

                  {/* Center Play Trailer Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    {movie.trailerUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayTrailer?.(movie);
                        }}
                        className="p-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
                        title="Xem Trailer"
                      >
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Movie Information */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    {/* Meta info: Genre & Duration */}
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mb-1.5">
                      <span className="text-pink-400/90 font-medium truncate max-w-[130px]">
                        {categories.slice(0, 2).join(' · ') || 'Điện ảnh'}
                      </span>
                      {movie.duration && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            <span>{movie.duration}p</span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Movie Name */}
                    <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1 leading-snug">
                      {movie.movieName}
                    </h3>

                    {/* Short Description */}
                    {movie.description && (
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed font-light">
                        {movie.description}
                      </p>
                    )}
                  </div>

                  {/* Card Action Row */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetails?.(movie);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Chi Tiết Phim</span>
                    </button>
                    {movie.trailerUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayTrailer?.(movie);
                        }}
                        className="py-2 px-3 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Xem Trailer"
                      >
                        <Play className="w-3.5 h-3.5 fill-pink-400" />
                        <span className="hidden sm:inline">Trailer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
