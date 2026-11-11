import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Ticket, Clock, Star, Sparkles, Film } from 'lucide-react';
import { MovieImage } from '../common/MovieImage';

export const MovieCard = ({ movie, onOpenDetails, onPlayTrailer }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  const isNowShowing = movie.status === 'NOW_SHOWING';
  const categories = Array.isArray(movie.categories) ? movie.categories : [];
  const primaryCategory = categories[0] || 'Điện ảnh';

  // Determine age rating indicator based on category or standard fallback
  const getAgeRating = () => {
    const text = (movie.movieName + ' ' + categories.join(' ')).toLowerCase();
    if (text.includes('kinh dị') || text.includes('horror') || text.includes('ma')) return { label: 'C18', color: 'bg-red-500/20 text-red-400 border-red-500/40' };
    if (text.includes('hành động') || text.includes('action') || text.includes('tội phạm')) return { label: 'C16', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' };
    if (text.includes('hoạt hình') || text.includes('animation') || text.includes('gia đình')) return { label: 'P', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
    return { label: 'C13', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
  };

  const ageRating = getAgeRating();

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(movie);
    } else {
      navigate(`/movie/${movie.movieId}`);
    }
  };

  const handleBookNowClick = (e) => {
    e.stopPropagation();
    navigate(`/movie/${movie.movieId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-gradient-to-b from-[#13161f] via-[#0f1117] to-[#0b0c10] border border-neutral-800/90 hover:border-amber-400/50 rounded-2xl overflow-hidden hover:shadow-[0_16px_40px_-10px_rgba(251,191,36,0.2)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative overflow-hidden aspect-[2/3] bg-neutral-950">
        <MovieImage
          src={movie.posterUrl}
          alt={movie.movieName}
          aspect="poster"
          fallbackTitle={movie.movieName}
          fallbackGenre={primaryCategory}
          className="group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Ambient bottom shade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13161f] via-transparent to-black/20" />

        {/* Top-left: Live status badge */}
        <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-mono font-medium border border-neutral-800 flex items-center gap-1.5 shadow-md">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isNowShowing ? 'bg-emerald-400 animate-pulse' : 'bg-pink-400'
            }`}
          />
          <span className={isNowShowing ? 'text-emerald-400 font-semibold' : 'text-pink-400 font-semibold'}>
            {isNowShowing ? 'Đang chiếu' : 'Sắp chiếu'}
          </span>
        </div>

        {/* Top-right: Age Rating Badge */}
        <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-mono font-extrabold border backdrop-blur-md shadow-md ${ageRating.color}`}>
          {ageRating.label}
        </div>

        {/* Center Hover Overlay: Play Trailer button */}
        <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4">
          {movie.trailerUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayTrailer?.(movie);
              }}
              className="p-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-neutral-950 hover:from-amber-300 hover:to-amber-200 shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Xem Trailer"
              aria-label="Xem Trailer"
            >
              <Play className="w-5 h-5 fill-neutral-950 ml-0.5" />
            </button>
          )}
        </div>

        {/* Bottom tags on poster */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-neutral-300">
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-neutral-700/60 font-semibold">
            2D • IMAX
          </span>
          <span className="flex items-center gap-1 text-amber-300 font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-neutral-700/60">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>9.6</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Genre & Duration */}
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span className="text-amber-400/90 font-medium truncate max-w-[130px]">
              {categories.slice(0, 2).join(' · ') || 'Điện ảnh'}
            </span>
            {movie.duration && (
              <span className="flex items-center gap-1 text-neutral-300 shrink-0">
                <Clock className="w-3 h-3 text-neutral-500" />
                <span>{movie.duration}p</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {movie.movieName}
          </h3>

          {/* Description snippet */}
          {movie.description && (
            <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light">
              {movie.description}
            </p>
          )}
        </div>

        {/* Card Footer: Direct Booking Button */}
        <div className="pt-3 border-t border-neutral-800/80">
          {isNowShowing ? (
            <button
              type="button"
              onClick={handleBookNowClick}
              className="w-full py-2.5 px-3 text-xs font-extrabold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-400/10 active:scale-98"
            >
              <Ticket className="w-4 h-4 fill-neutral-950" />
              <span>ĐẶT VÉ NGAY</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBookNowClick}
              className="w-full py-2 px-3 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Xem Thông Tin & Lịch Chiếu</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
