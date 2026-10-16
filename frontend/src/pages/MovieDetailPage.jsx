import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  User, 
  Film, 
  Calendar, 
  Play, 
  Ticket, 
  MapPin, 
  ChevronRight, 
  Sparkles,
  ArrowLeft,
  X
} from 'lucide-react';
import { movieApi, showtimeApi } from '../api';
import { MovieImage } from '../components/common/MovieImage';

export const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Generate next 7 days list: [{ value: 'YYYY-MM-DD', label: 'Hôm nay', dayMonth: '11/10', weekday: 'T7' }, ...]
  const dateTabs = useMemo(() => {
    const tabs = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const value = `${year}-${month}-${day}`;

      let label = `${day}/${month}`;
      let subLabel = '';
      if (i === 0) {
        label = 'Hôm nay';
        subLabel = `${day}/${month}`;
      } else if (i === 1) {
        label = 'Ngày mai';
        subLabel = `${day}/${month}`;
      } else {
        const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        label = daysOfWeek[d.getDay()];
        subLabel = `${day}/${month}`;
      }

      tabs.push({ value, label, subLabel, dateObj: d });
    }
    return tabs;
  }, []);

  // Initialize selectedDate to today
  useEffect(() => {
    if (dateTabs.length > 0 && !selectedDate) {
      setSelectedDate(dateTabs[0].value);
    }
  }, [dateTabs, selectedDate]);

  // Load movie detail
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await movieApi.getById(id);
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchMovie();
    }
  }, [id]);

  // Load showtimes whenever selectedDate changes
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!id || !selectedDate) return;
      try {
        setLoadingShowtimes(true);
        const data = await showtimeApi.getByMovie(id, selectedDate);
        setShowtimes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching showtimes:', err);
        setShowtimes([]);
      } finally {
        setLoadingShowtimes(false);
      }
    };
    fetchShowtimes();
  }, [id, selectedDate]);

  // Group showtimes by cinema and then room/format
  const groupedCinemas = useMemo(() => {
    const map = {};
    showtimes.forEach((st) => {
      const cId = st.cinemaId || st.room?.cinema?.cinemaId || 'default';
      const cName = st.cinemaName || st.room?.cinema?.cinemaName || 'CinePrime Cinema';
      const cAddress = st.cinemaAddress || st.room?.cinema?.address || '';

      if (!map[cId]) {
        map[cId] = {
          cinemaId: cId,
          cinemaName: cName,
          cinemaAddress: cAddress,
          formats: {},
        };
      }

      const format = st.format || st.room?.roomType || '2D Digital';
      if (!map[cId].formats[format]) {
        map[cId].formats[format] = [];
      }
      map[cId].formats[format].push(st);
    });

    // Sort times in each format
    Object.values(map).forEach((c) => {
      Object.keys(c.formats).forEach((fmt) => {
        c.formats[fmt].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
      });
    });

    return Object.values(map);
  }, [showtimes]);

  const formatPriceVND = (price) => {
    if (!price && price !== 0) return '';
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  // Extract YouTube embed URL if trailerUrl is provided
  const getEmbedTrailerUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/embed/')) return url;
      if (url.includes('youtube.com/watch')) {
        const v = new URL(url).searchParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}?autoplay=1` : url;
      }
      if (url.includes('youtu.be/')) {
        const v = url.split('youtu.be/')[1]?.split('?')[0];
        return v ? `https://www.youtube.com/embed/${v}?autoplay=1` : url;
      }
      return url;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          <div className="h-96 bg-neutral-900/60 rounded-2xl border border-neutral-800" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-72 bg-neutral-900/60 rounded-xl border border-neutral-800" />
            <div className="md:col-span-2 h-72 bg-neutral-900/60 rounded-xl border border-neutral-800" />
          </div>
          <div className="h-64 bg-neutral-900/60 rounded-xl border border-neutral-800" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-neutral-100 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <Film className="w-16 h-16 text-neutral-600 mx-auto" />
          <h2 className="text-2xl font-bold font-display text-white">Không tìm thấy phim</h2>
          <p className="text-sm text-neutral-400">
            Thông tin bộ phim bạn yêu cầu không tồn tại hoặc đã ngừng phát hành.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedTrailerUrl(movie.trailerUrl);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 pb-20">
      {/* Hero Header with Backdrop Image & Gradient Overlay */}
      <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] overflow-hidden bg-neutral-950">
        <img
          src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600'}
          alt={movie.movieName}
          className="w-full h-full object-cover object-center filter blur-[1px] brightness-75 scale-105"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_50%)]" />

        {/* Back navigation */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-neutral-800 backdrop-blur-md transition-colors text-xs font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Hero floating action button */}
        {movie.trailerUrl && (
          <div className="absolute bottom-8 right-4 sm:right-8 z-10">
            <button
              onClick={() => setShowTrailerModal(true)}
              className="flex items-center gap-2.5 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm rounded-xl transition-all hover:scale-105 shadow-2xl cursor-pointer"
            >
              <Play className="w-4 h-4 fill-neutral-950" />
              <span>Xem Trailer Chính Thức</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 sm:-mt-52 relative z-10 space-y-10">
        {/* Movie Info Card */}
        <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Poster column */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-neutral-800 aspect-[2/3] max-w-[280px] mx-auto md:max-w-none group relative">
                <MovieImage
                  src={movie.posterUrl}
                  alt={movie.movieName}
                  aspect="poster"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  fallbackTitle={movie.movieName}
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-2.5 py-1 text-[11px] font-bold font-mono uppercase rounded bg-amber-400 text-neutral-950 shadow-md">
                    {movie.status === 'NOW_SHOWING' ? 'Đang Chiếu' : movie.status === 'COMING_SOON' ? 'Sắp Chiếu' : movie.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Details column */}
            <div className="md:col-span-8 lg:col-span-9 space-y-5">
              {/* Badges / Categories */}
              <div className="flex flex-wrap items-center gap-2">
                {movie.categories?.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-amber-400/90 rounded-full text-xs font-mono font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-wide leading-tight">
                {movie.movieName}
              </h1>

              {/* Synopsis */}
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {movie.description || 'Chưa có tóm tắt nội dung cho phim này.'}
              </p>

              {/* 2x2 Info Grid with Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
                  <div className="p-2 bg-neutral-900 rounded-lg text-amber-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase block">Thời Lượng</span>
                    <span className="text-sm font-semibold text-neutral-200">{movie.duration} phút</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
                  <div className="p-2 bg-neutral-900 rounded-lg text-amber-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase block">Đạo Diễn</span>
                    <span className="text-sm font-semibold text-neutral-200">{movie.director || 'Đang cập nhật'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
                  <div className="p-2 bg-neutral-900 rounded-lg text-amber-400 shrink-0">
                    <Film className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono text-neutral-500 uppercase block">Diễn Viên</span>
                    <span className="text-sm font-semibold text-neutral-200 line-clamp-1">
                      {movie.actors || 'Đang cập nhật'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
                  <div className="p-2 bg-neutral-900 rounded-lg text-amber-400 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase block">Khởi Chiếu</span>
                    <span className="text-sm font-semibold text-neutral-200">{movie.releaseDate || 'Đang cập nhật'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes & Booking Section */}
        <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lịch Chiếu & Suất Xem</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                Chọn Ngày & Suất Chiếu
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              Ghế được cập nhật theo thời gian thực
            </span>
          </div>

          {/* DATE TABS: Horizontal scrollable next 7 days */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {dateTabs.map((tab) => {
              const isActive = selectedDate === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedDate(tab.value)}
                  className={`flex flex-col items-center justify-center px-5 py-3 rounded-xl border text-center shrink-0 min-w-[90px] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 border-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-400/20 scale-[1.02]'
                      : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <span className={`text-xs font-mono uppercase ${isActive ? 'text-neutral-950 font-bold' : 'text-neutral-300'}`}>
                    {tab.label}
                  </span>
                  <span className={`text-sm font-mono mt-0.5 ${isActive ? 'text-neutral-950 font-extrabold' : 'text-neutral-500'}`}>
                    {tab.subLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Showtimes Listing grouped by Cinema & Room/Format */}
          <div className="space-y-6 pt-2">
            {loadingShowtimes ? (
              <div className="p-12 text-center text-neutral-400 font-mono text-xs space-y-3">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Đang tải lịch chiếu...</p>
              </div>
            ) : groupedCinemas.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-neutral-400 bg-neutral-950/40 rounded-xl border border-neutral-800/80 space-y-2">
                <Film className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-sm font-semibold text-neutral-300">
                  Không có suất chiếu nào vào ngày đã chọn
                </p>
                <p className="text-neutral-500">
                  Vui lòng chọn ngày khác hoặc quay lại sau để cập nhật lịch chiếu mới nhất.
                </p>
              </div>
            ) : (
              groupedCinemas.map((cinema) => (
                <div
                  key={cinema.cinemaId}
                  className="bg-neutral-950/70 border border-neutral-800/90 rounded-xl p-5 sm:p-6 space-y-4"
                >
                  {/* Cinema Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-display text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{cinema.cinemaName}</span>
                      </h3>
                      {cinema.cinemaAddress && (
                        <p className="text-xs text-neutral-400 mt-1 pl-6">
                          {cinema.cinemaAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Formats and times */}
                  <div className="space-y-4 pt-2">
                    {Object.entries(cinema.formats).map(([formatName, list]) => (
                      <div key={formatName} className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800/60 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-amber-400 uppercase tracking-wide">
                            {formatName}
                          </span>
                          <span className="text-neutral-400">
                            Giá từ: <span className="text-neutral-200 font-semibold">{formatPriceVND(list[0]?.price || 75000)}</span>
                          </span>
                        </div>

                        {/* Showtime buttons */}
                        <div className="flex flex-wrap gap-3">
                          {list.map((st) => {
                            const timeString = st.startTime ? st.startTime.substring(0, 5) : '00:00';
                            return (
                              <button
                                key={st.showtimeId}
                                onClick={() => navigate(`/booking/${st.showtimeId}/seats`)}
                                className="group px-4 py-2.5 bg-neutral-900 hover:bg-amber-400 text-neutral-200 hover:text-neutral-950 rounded-lg border border-neutral-800 hover:border-amber-400 transition-all font-mono text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105"
                              >
                                <Ticket className="w-3.5 h-3.5 text-amber-400 group-hover:text-neutral-950 transition-colors" />
                                <span>{timeString}</span>
                                {st.roomName && (
                                  <span className="text-[10px] text-neutral-500 group-hover:text-neutral-900/80 font-normal">
                                    ({st.roomName})
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && embedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#0f1117] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-white font-medium">Trailer Phim</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-400">{movie.movieName}</span>
              </div>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video iframe */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={embedUrl}
                title={`Trailer ${movie.movieName}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
