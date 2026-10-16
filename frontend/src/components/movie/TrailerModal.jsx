import React from 'react';
import { X, Play, Ticket, ExternalLink } from 'lucide-react';

export const TrailerModal = ({ movie, onClose, onBookNow }) => {
  if (!movie) return null;

  const title = movie.movieName;

  // Extract YouTube video ID from various URL formats
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(movie.trailerUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-white font-medium">Trailer Phim</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-300 font-semibold truncate max-w-xs sm:max-w-md">
              {title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`Trailer: ${title}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                <Play className="w-8 h-8 ml-1" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-medium text-sm">
                  Chưa có sẵn video trailer nhúng cho phim này
                </p>
                {movie.trailerUrl && (
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 underline font-mono"
                  >
                    <span>Mở link gốc trực tiếp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="p-4 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold font-display text-white line-clamp-1">
              {title}
            </h4>
            <div className="text-xs text-neutral-400 font-mono">
              {movie.duration && <span>{movie.duration} phút · </span>}
              <span>{Array.isArray(movie.categories) ? movie.categories.join(', ') : ''}</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookNow?.(movie.movieId);
            }}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg transition-colors flex items-center gap-2 text-xs shadow-md shrink-0 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Đặt Vé Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
