import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Film, Search, X } from 'lucide-react';
import { movieApi, showtimeApi } from '../api';
import { HeroBanner } from '../components/home/HeroBanner';
import { FormatsShowcase } from '../components/home/FormatsShowcase';
import { MovieCard } from '../components/movie/MovieCard';
import { TrailerModal } from '../components/movie/TrailerModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [allMovies, setAllMovies] = useState([]);
  const [featuredShowtimes, setFeaturedShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedTrailerMovie, setSelectedTrailerMovie] = useState(null);

  // Sync search input with URL search param
  useEffect(() => {
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const data = await movieApi.getAll();
      const movieList = Array.isArray(data) ? data : [];
      setAllMovies(movieList);

      // Fetch showtimes for the first now-showing movie for the HeroBanner
      const firstNowShowing = movieList.find((m) => m.status === 'NOW_SHOWING');
      if (firstNowShowing) {
        try {
          const stData = await showtimeApi.getByMovie(firstNowShowing.movieId);
          setFeaturedShowtimes(Array.isArray(stData) ? stData : []);
        } catch (stErr) {
          console.warn('Could not load showtimes for featured movie:', stErr);
        }
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter movies based on search query
  const filteredMovies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allMovies;
    return allMovies.filter((m) => {
      const matchName = m.movieName?.toLowerCase().includes(q);
      const matchDesc = m.description?.toLowerCase().includes(q);
      const matchCat = Array.isArray(m.categories) && m.categories.some((c) => c.toLowerCase().includes(q));
      return matchName || matchDesc || matchCat;
    });
  }, [allMovies, searchQuery]);

  const nowShowingMovies = useMemo(
    () => filteredMovies.filter((m) => m.status === 'NOW_SHOWING'),
    [filteredMovies]
  );

  const comingSoonMovies = useMemo(
    () => filteredMovies.filter((m) => m.status === 'COMING_SOON'),
    [filteredMovies]
  );

  const featuredMovie = useMemo(
    () => allMovies.find((m) => m.status === 'NOW_SHOWING') || allMovies[0] || null,
    [allMovies]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const handleHeroBookNow = (targetId) => {
    // If showtimeId is provided, navigate to seat selection, else movie details
    if (typeof targetId === 'number' && featuredShowtimes.some((st) => st.showtimeId === targetId)) {
      navigate(`/booking/${targetId}/seats`);
    } else if (featuredMovie?.movieId) {
      navigate(`/movie/${featuredMovie.movieId}`);
    }
  };

  const handleOpenDetails = (movie) => {
    navigate(`/movie/${movie.movieId}`);
  };

  const handlePlayTrailer = (movie) => {
    setSelectedTrailerMovie(movie);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 flex flex-col">
      {/* 1. Hero Banner: Show spotlight for featured movie if not actively filtering */}
      {!queryParam && featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          showtimes={featuredShowtimes}
          onBookNow={handleHeroBookNow}
          onPlayTrailer={handlePlayTrailer}
        />
      )}

      {/* 2. Interactive Search & Filter Bar */}
      <section className="border-b border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
              Lịch Chiếu Phim Rạp CinePrime
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Chọn phim yêu thích và trải nghiệm chuẩn điện ảnh đỉnh cao hôm nay
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm phim theo tên hoặc thể loại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-amber-400 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-xl text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* Search results banner if active search */}
      {queryParam && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full flex items-center justify-between">
          <div className="text-sm font-mono text-neutral-300">
            Kết quả tìm kiếm cho: <span className="text-amber-400 font-semibold">"{queryParam}"</span> ({filteredMovies.length} bộ phim)
          </div>
          <button
            onClick={handleClearSearch}
            className="text-xs text-neutral-400 hover:text-amber-400 underline font-mono cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner message="Đang tải danh sách phim từ CinePrime..." />
      ) : (
        <div className="space-y-16 py-10">
          {/* 3. Phim Đang Chiếu */}
          <section id="now-showing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-neutral-800/80">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                  TRẢI NGHIỆM TẠI RẠP
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Phim Đang Chiếu
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {nowShowingMovies.length} bộ phim
              </span>
            </div>

            {nowShowingMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {nowShowingMovies.map((movie) => (
                  <MovieCard
                    key={movie.movieId}
                    movie={movie}
                    onOpenDetails={handleOpenDetails}
                    onPlayTrailer={handlePlayTrailer}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/30 rounded-2xl border border-neutral-800">
                <Film className="w-10 h-10 text-neutral-600 mb-3" />
                <p className="text-sm text-neutral-400 font-mono">
                  {queryParam ? 'Không tìm thấy phim đang chiếu phù hợp với từ khóa.' : 'Hiện tại chưa có phim đang chiếu.'}
                </p>
              </div>
            )}
          </section>

          {/* 4. Phim Sắp Chiếu */}
          <section id="coming-soon" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-neutral-800/80">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-semibold">
                  SẮP KHỞI CHIẾU
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Phim Sắp Chiếu
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {comingSoonMovies.length} bộ phim
              </span>
            </div>

            {comingSoonMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {comingSoonMovies.map((movie) => (
                  <MovieCard
                    key={movie.movieId}
                    movie={movie}
                    onOpenDetails={handleOpenDetails}
                    onPlayTrailer={handlePlayTrailer}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/30 rounded-2xl border border-neutral-800">
                <Film className="w-10 h-10 text-neutral-600 mb-3" />
                <p className="text-sm text-neutral-400 font-mono">
                  {queryParam ? 'Không tìm thấy phim sắp chiếu phù hợp.' : 'Hiện tại chưa có danh sách phim sắp chiếu.'}
                </p>
              </div>
            )}
          </section>

          {/* 5. Formats Showcase Section */}
          <FormatsShowcase />
        </div>
      )}

      {/* Trailer Modal Overlay */}
      {selectedTrailerMovie && (
        <TrailerModal
          movie={selectedTrailerMovie}
          onClose={() => setSelectedTrailerMovie(null)}
          onBookNow={(movieId) => {
            setSelectedTrailerMovie(null);
            navigate(`/movie/${movieId}`);
          }}
        />
      )}
    </div>
  );
};
