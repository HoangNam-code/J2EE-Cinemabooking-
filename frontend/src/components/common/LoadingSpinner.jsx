import React from 'react';
import { Film } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Đang tải dữ liệu...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-2xl">
          <Film className="w-8 h-8 text-amber-400 animate-pulse" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-amber-400/20 blur-sm -z-10 animate-pulse" />
      </div>

      <div className="space-y-2 text-center max-w-xs">
        <p className="text-sm font-medium text-neutral-200">{message}</p>
        <div className="w-48 h-1.5 bg-neutral-900 rounded-full overflow-hidden mx-auto border border-neutral-800">
          <div className="w-full h-full bg-gradient-to-r from-amber-500/20 via-amber-400 to-amber-500/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
