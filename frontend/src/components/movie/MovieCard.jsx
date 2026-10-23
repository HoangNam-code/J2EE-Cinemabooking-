import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Ticket, Clock, Star, Calendar } from 'lucide-react';
import { MovieImage } from '../common/MovieImage';

export const MovieCard = ({ movie, onOpenDetails, onPlayTrailer }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  const isNowShowing = movie.status === 'NOW_SHOWING';
  const categories = Array.isArray(movie.categories) ? movie.categories : [];
  const primaryCategory = categories[0] || 'Điện ảnh';

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(movie);
    } else {
      navigate(`/movie/${movie.movieId}`);
    }
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    navigate(`/movie/${movie.movieId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-neutral-900/60 border border-neutral-800/80 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-200 cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative overflow-hidden aspect-[2/3] bg-neutral-950">
        <MovieImage
          src={movie.posterUrl}
          alt={movie.movieName}
          aspect="poster"
          fallbackTitle={movie.movieName}
          fallbackGenre={primaryCategory}
          className="group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover overlay with trailer trigger */}
        <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4">
          {movie.trailerUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayTrailer?.(movie);
              }}
              className="p-3.5 rounded-full bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-xl transition-transform hover:scale-110 cursor-pointer"
              title="Xem Trailer"
              aria-label="Xem Trailer"
            >
              <Play className="w-5 h-5 fill-neutral-950 ml-0.5" />
            </button>
          )}
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono font-medium border border-neutral-800 flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isNowShowing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className={isNowShowing ? 'text-emerald-400' : 'text-amber-400'}>
            {isNowShowing ? 'Đang chiếu' : 'Sắp chiếu'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Metadata: Genre · Duration · Critic Score */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span className="truncate max-w-[120px]">{categories.slice(0, 2).join(' / ') || 'Điện ảnh'}</span>
            {movie.duration && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-neutral-300 shrink-0">
                  <Clock className="w-3 h-3 text-neutral-500" />
                  <span>{movie.duration}p</span>
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>9.5</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {movie.movieName}
          </h3>

          {/* Formats info */}
          <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1.5 flex-wrap">
            <span className="text-neutral-300">2D Digital</span>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-300">IMAX Laser</span>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-300">Dolby Atmos</span>
          </div>

          {/* Synopsis */}
          {movie.description && (
            <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
              {movie.description}
            </p>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-neutral-800/80">
          {isNowShowing ? (
            <button
              onClick={handleActionClick}
              className="w-full py-2.5 px-3 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Mua Vé Ngay</span>
            </button>
          ) : (
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>{movie.releaseDate || 'Sắp phát hành'}</span>
              </span>
              <button
                onClick={handleActionClick}
                className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
              >
                Chi Tiết
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
