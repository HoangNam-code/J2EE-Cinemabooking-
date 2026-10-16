import React, { useState } from 'react';
import { Film } from 'lucide-react';

export const MovieImage = ({
  src,
  alt = '',
  className = '',
  aspect = 'poster',
  fallbackTitle,
  fallbackGenre,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass =
    aspect === 'poster'
      ? 'aspect-[2/3]'
      : aspect === 'backdrop'
      ? 'aspect-[16/9]'
      : 'aspect-square';

  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800/80 flex flex-col justify-end p-5 select-none ${aspectClass} ${className}`}
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-4 right-4 text-amber-500/40">
          <Film className="w-8 h-8" />
        </div>
        <div className="relative z-10 space-y-1.5">
          <span className="text-[10px] tracking-widest uppercase text-amber-400/90 font-medium font-mono">
            {fallbackGenre || 'CINEPRIME EXCLUSIVE'}
          </span>
          <h4 className="text-base font-semibold font-display text-white line-clamp-2 leading-snug">
            {fallbackTitle || alt}
          </h4>
          <span className="inline-block text-[11px] text-neutral-400">Trình chiếu điện ảnh</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-950 ${aspectClass} ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
          <Film className="w-6 h-6 text-neutral-700 animate-pulse" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
