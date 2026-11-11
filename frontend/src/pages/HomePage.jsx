import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Film, Search, X, Sparkles, SlidersHorizontal, ArrowUpDown, Flame, Clapperboard, Check } from 'lucide-react';
import { movieApi, showtimeApi } from '../api';
import { HeroBanner } from '../components/home/HeroBanner';
import { ComingSoonSpotlight } from '../components/home/ComingSoonSpotlight';
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

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'NOW_SHOWING' | 'COMING_SOON'
  const [sortBy, setSortBy] = useState('DEFAULT'); // 'DEFAULT' | 'NAME_ASC' | 'DURATION_DESC' | 'DURATION_ASC'
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

  // Distinct categories extracted from all active movies
  const availableCategories = useMemo(() => {
    const catSet = new Set();
    allMovies.forEach((m) => {
      if (Array.isArray(m.categories)) {
        m.categories.forEach((c) => {
          if (c && c.trim()) catSet.add(c.trim());
        });
      }
    });
    return ['ALL', ...Array.from(catSet)];
  }, [allMovies]);

  // Filter movies based on search query, category, status, and sorting
  const filteredMovies = useMemo(() => {
    let result = [...allMovies];

    // 1. Text search
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((m) => {
        const matchName = m.movieName?.toLowerCase().includes(q);
        const matchDesc = m.description?.toLowerCase().includes(q);
        const matchDirector = m.director?.toLowerCase().includes(q);
        const matchCat = Array.isArray(m.categories) && m.categories.some((c) => c.toLowerCase().includes(q));
        return matchName || matchDesc || matchDirector || matchCat;
      });
    }

    // 2. Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((m) => Array.isArray(m.categories) && m.categories.includes(selectedCategory));
    }

    // 3. Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((m) => m.status === statusFilter);
    }

    // 4. Sorting
    if (sortBy === 'NAME_ASC') {
      result.sort((a, b) => (a.movieName || '').localeCompare(b.movieName || ''));
    } else if (sortBy === 'DURATION_DESC') {
      result.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    } else if (sortBy === 'DURATION_ASC') {
      result.sort((a, b) => (a.duration || 0) - (b.duration || 0));
    }

    return result;
  }, [allMovies, searchQuery, selectedCategory, statusFilter, sortBy]);

  // Separate now showing and coming soon subsets
  const nowShowingMovies = useMemo(
    () => filteredMovies.filter((m) => m.status === 'NOW_SHOWING'),
    [filteredMovies]
  );

  const comingSoonMovies = useMemo(
    () => allMovies.filter((m) => m.status === 'COMING_SOON'),
    [allMovies]
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

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setStatusFilter('ALL');
    setSortBy('DEFAULT');
    setSearchParams({});
  };

  const handleHeroBookNow = (targetId) => {
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

  const isFilteringActive = searchQuery.trim() !== '' || selectedCategory !== 'ALL' || statusFilter !== 'ALL' || sortBy !== 'DEFAULT';

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 flex flex-col">
      {/* 1. Hero Banner: Hiển thị phim tiêu điểm lớn đầu trang */}
      {!isFilteringActive && featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          showtimes={featuredShowtimes}
          onBookNow={handleHeroBookNow}
          onPlayTrailer={handlePlayTrailer}
        />
      )}

      {/* 2. GIỚI THIỆU PHIM SẮP CHIẾU LÊN TRÊN ĐẦU (COMING SOON SPOTLIGHT) */}
      {!isFilteringActive && comingSoonMovies.length > 0 && (
        <ComingSoonSpotlight
          movies={comingSoonMovies}
          onOpenDetails={handleOpenDetails}
          onPlayTrailer={handlePlayTrailer}
        />
      )}

      {/* 3. BỘ CÔNG CỤ TÌM KIẾM & BỘ LỌC PHIM THÔNG MINH (SMART MOVIE FINDER) */}
      <section className="sticky top-18 z-30 bg-[#0d0f15]/95 backdrop-blur-md border-b border-neutral-800/90 py-4 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto space-y-3.5">
          {/* Hàng 1: Ô tìm kiếm nhanh, Tab Trạng thái & Sắp xếp */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Title & Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Clapperboard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Khám Phá Phim Chiếu Rạp
                </h2>
                <span className="text-[11px] font-mono text-neutral-400">
                  {filteredMovies.length} bộ phim sẵn sàng
                </span>
              </div>
            </div>

            {/* Controls: Search Input + Status Filter + Sort */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              {/* Search Bar with live filter */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm phim, đạo diễn, thể loại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchParams({});
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Status Tabs: Tất cả | Đang chiếu | Sắp chiếu */}
              <div className="inline-flex p-0.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-amber-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('NOW_SHOWING')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === 'NOW_SHOWING'
                      ? 'bg-amber-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Đang chiếu
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('COMING_SOON')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === 'COMING_SOON'
                      ? 'bg-amber-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Sắp chiếu
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer font-mono"
                >
                  <option value="DEFAULT">Sắp xếp: Mặc định</option>
                  <option value="NAME_ASC">Tên phim (A - Z)</option>
                  <option value="DURATION_DESC">Thời lượng (Dài nhất)</option>
                  <option value="DURATION_ASC">Thời lượng (Ngắn nhất)</option>
                </select>
              </div>

              {/* Reset filters button if filtering */}
              {isFilteringActive && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer shrink-0 ml-1"
                >
                  Đặt lại lọc
                </button>
              )}
            </div>
          </div>

          {/* Hàng 2: Thanh Pill Lọc Thể Loại (Category Filter Pills) cuộn ngang */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-xs font-mono">
            <span className="text-neutral-500 shrink-0 text-[11px] mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-neutral-500" />
              <span>Thể loại:</span>
            </span>
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-sm'
                      : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {cat === 'ALL' ? 'Tất cả thể loại' : cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner message="Đang tải danh sách phim từ CinePrime..." />
      ) : (
        <div className="space-y-16 py-10">
          {/* 4. PHIM ĐANG CHIẾU (NOW SHOWING) - THIẾT KẾ LẠI CÁCH TRÌNH BÀY HIỆN ĐẠI */}
          <section id="now-showing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-800/80 gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>TRẢI NGHIỆM ĐIỆN ẢNH TẠI RẠP</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                  {statusFilter === 'COMING_SOON' ? 'Danh Sách Phim Sắp Chiếu' : 'Phim Đang Chiếu Tại Rạp'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Chọn suất chiếu ngay hôm nay để thưởng thức định dạng âm thanh vòm Dolby Atmos & màn ảnh rộng IMAX Laser
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-neutral-400 self-start sm:self-auto">
                <span className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
                  {statusFilter === 'COMING_SOON' ? comingSoonMovies.length : nowShowingMovies.length} bộ phim sẵn sàng
                </span>
              </div>
            </div>

            {/* Grid hiển thị phim đang chiếu */}
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(statusFilter === 'COMING_SOON' ? comingSoonMovies : (statusFilter === 'ALL' ? filteredMovies : nowShowingMovies)).map((movie) => (
                  <MovieCard
                    key={movie.movieId}
                    movie={movie}
                    onOpenDetails={handleOpenDetails}
                    onPlayTrailer={handlePlayTrailer}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-16 text-center bg-neutral-900/30 rounded-2xl border border-neutral-800">
                <Film className="w-12 h-12 text-neutral-600 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Không tìm thấy phim phù hợp</h3>
                <p className="text-xs text-neutral-400 font-mono max-w-md">
                  Không có kết quả nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại. Vui lòng thử tìm từ khóa khác.
                </p>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </section>

          {/* 5. KHÁM PHÁ CÔNG NGHỆ PHÒNG CHIẾU (FORMATS SHOWCASE) */}
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
