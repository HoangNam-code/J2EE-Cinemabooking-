import React, { useEffect, useState, useMemo } from 'react';
import { adminApi, movieApi, categoryApi } from '../../api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Film,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  Calendar,
  Clock,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  TrendingUp,
  Ticket,
  Video,
  Clapperboard,
  RefreshCw,
  Users,
  ShieldAlert,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' | 'categories' | 'add-movie' | 'showtimes'
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bộ lọc Phim
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // State cho Quản Lý Thể Loại
  const [newCategory, setNewCategory] = useState({ categoryName: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);

  // Form Thêm / Sửa Phim
  const [movieForm, setMovieForm] = useState({
    movieName: '',
    duration: 120,
    director: '',
    actors: '',
    description: '',
    releaseDate: '2026-10-16',
    endDate: '2026-12-31',
    posterUrl: '',
    trailerUrl: '',
    status: 'NOW_SHOWING',
    categoryIds: [],
  });
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [submittingMovie, setSubmittingMovie] = useState(false);

  // Form Xếp Lịch Chiếu
  const [newShowtime, setNewShowtime] = useState({
    movieId: '',
    roomId: 1,
    showDate: new Date().toISOString().split('T')[0],
    startTime: '19:00:00',
    price: 90000,
    format: '2D',
  });
  const [submittingShowtime, setSubmittingShowtime] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, moviesData, categoriesData, usersData] = await Promise.all([
        adminApi.getStats().catch(() => null),
        movieApi.getAll().catch(() => []),
        categoryApi.getAll().catch(() => []),
        adminApi.getUsers().catch(() => []),
      ]);
      setStats(statsData);
      setMovies(moviesData || []);
      setCategories(categoriesData || []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      if (moviesData && moviesData.length > 0 && !newShowtime.movieId) {
        setNewShowtime((prev) => ({ ...prev, movieId: moviesData[0].movieId }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải dữ liệu trang quản trị');
    } finally {
      setLoading(false);
    }
  };

  // --- LỌC PHIM THEO THỂ LOẠI & TÌM KIẾM ---
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      // 1. Lọc theo thể loại
      const matchesCategory =
        selectedCategory === 'ALL' ||
        (m.categories && m.categories.includes(selectedCategory));

      // 2. Lọc theo trạng thái
      const matchesStatus =
        statusFilter === 'ALL' || m.status === statusFilter;

      // 3. Lọc theo từ khóa tìm kiếm (tên phim, đạo diễn, diễn viên)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        m.movieName.toLowerCase().includes(query) ||
        (m.director && m.director.toLowerCase().includes(query)) ||
        (m.actors && m.actors.toLowerCase().includes(query));

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [movies, selectedCategory, statusFilter, searchQuery]);

  // Phân trang
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage) || 1;
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(start, start + itemsPerPage);
  }, [filteredMovies, currentPage]);

  // Đếm số phim theo từng thể loại
  const categoryCountMap = useMemo(() => {
    const map = {};
    movies.forEach((m) => {
      if (m.categories && Array.isArray(m.categories)) {
        m.categories.forEach((cat) => {
          map[cat] = (map[cat] || 0) + 1;
        });
      }
    });
    return map;
  }, [movies]);

  // --- THAO TÁC THỂ LOẠI (CATEGORY CRUD) ---
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.categoryName.trim()) {
      toast.error('Vui lòng nhập tên thể loại');
      return;
    }
    try {
      setSavingCategory(true);
      await categoryApi.create(newCategory);
      toast.success(`Đã thêm thể loại "${newCategory.categoryName}" thành công!`);
      setNewCategory({ categoryName: '', description: '' });
      const updatedCats = await categoryApi.getAll();
      setCategories(updatedCats || []);
    } catch (err) {
      toast.error(err.message || 'Lỗi thêm thể loại');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.categoryName.trim()) return;
    try {
      setSavingCategory(true);
      await categoryApi.update(editingCategory.categoryId, editingCategory);
      toast.success('Cập nhật thể loại thành công!');
      setEditingCategory(null);
      const [updatedCats, updatedMovies] = await Promise.all([
        categoryApi.getAll(),
        movieApi.getAll(),
      ]);
      setCategories(updatedCats || []);
      setMovies(updatedMovies || []);
    } catch (err) {
      toast.error(err.message || 'Lỗi cập nhật thể loại');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thể loại "${cat.categoryName}"?`)) return;
    try {
      await categoryApi.delete(cat.categoryId);
      toast.success('Đã xóa thể loại thành công');
      const [updatedCats, updatedMovies] = await Promise.all([
        categoryApi.getAll(),
        movieApi.getAll(),
      ]);
      setCategories(updatedCats || []);
      setMovies(updatedMovies || []);
      if (selectedCategory === cat.categoryName) {
        setSelectedCategory('ALL');
      }
    } catch (err) {
      toast.error(err.message || 'Không thể xóa thể loại này');
    }
  };

  // --- THAO TÁC PHIM (MOVIE CRUD) ---
  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      setSubmittingMovie(true);
      const payload = {
        ...movieForm,
        duration: Number(movieForm.duration),
      };

      if (editingMovieId) {
        await adminApi.updateMovie(editingMovieId, payload);
        toast.success(`Đã cập nhật phim "${movieForm.movieName}" thành công!`);
      } else {
        await adminApi.createMovie(payload);
        toast.success(`Đã thêm phim mới "${movieForm.movieName}" thành công!`);
      }

      resetMovieForm();
      setActiveTab('movies');
      loadDashboard();
    } catch (err) {
      toast.error(err.message || 'Lỗi lưu thông tin phim');
    } finally {
      setSubmittingMovie(false);
    }
  };

  const handleStartEditMovie = (m) => {
    // Tìm các ID thể loại tương ứng
    const matchedCategoryIds = categories
      .filter((c) => m.categories && m.categories.includes(c.categoryName))
      .map((c) => c.categoryId);

    setMovieForm({
      movieName: m.movieName,
      duration: m.duration || 120,
      director: m.director || '',
      actors: m.actors || '',
      description: m.description || '',
      releaseDate: m.releaseDate || '2026-10-16',
      endDate: m.endDate || '2026-12-31',
      posterUrl: m.posterUrl || '',
      trailerUrl: m.trailerUrl || '',
      status: m.status || 'NOW_SHOWING',
      categoryIds: matchedCategoryIds,
    });
    setEditingMovieId(m.movieId);
    setActiveTab('add-movie');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const resetMovieForm = () => {
    setMovieForm({
      movieName: '',
      duration: 120,
      director: '',
      actors: '',
      description: '',
      releaseDate: '2026-10-16',
      endDate: '2026-12-31',
      posterUrl: '',
      trailerUrl: '',
      status: 'NOW_SHOWING',
      categoryIds: [],
    });
    setEditingMovieId(null);
  };

  const handleDeleteMovie = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bộ phim "${title}" (ID: #${id})?`)) return;
    try {
      await adminApi.deleteMovie(id);
      toast.success('Đã xóa phim thành công');
      loadDashboard();
    } catch (err) {
      toast.error(err.message || 'Lỗi xóa phim');
    }
  };

  const toggleCategorySelection = (catId) => {
    setMovieForm((prev) => {
      const exists = prev.categoryIds.includes(catId);
      const nextIds = exists
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId];
      return { ...prev, categoryIds: nextIds };
    });
  };

  // --- THAO TÁC QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG (RBAC) ---
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await adminApi.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`Đã phân quyền thành công tài khoản sang vai trò: ${newRole}!`);
    } catch (err) {
      toast.error(err.message || 'Lỗi khi cập nhật phân quyền');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      setUpdatingUserId(userId);
      await adminApi.updateUserStatus(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, status: nextStatus } : u))
      );
      toast.success(`Đã chuyển trạng thái tài khoản thành: ${nextStatus}!`);
    } catch (err) {
      toast.error(err.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${username}" không?`)) {
      return;
    }
    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      toast.success(`Đã xóa tài khoản "${username}" thành công!`);
    } catch (err) {
      toast.error(err.message || 'Không thể xóa tài khoản này');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      const q = userSearchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        (u.fullName || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone || '').includes(q);
      return matchRole && matchSearch;
    });
  }, [users, userRoleFilter, userSearchQuery]);

  // --- THAO TÁC XẾP LỊCH CHIẾU ---
  const handleAddShowtime = async (e) => {
    e.preventDefault();
    try {
      setSubmittingShowtime(true);
      await adminApi.createShowtime({
        movieId: Number(newShowtime.movieId),
        roomId: Number(newShowtime.roomId),
        showDate: newShowtime.showDate,
        startTime: newShowtime.startTime,
        price: Number(newShowtime.price),
        format: newShowtime.format,
      });
      toast.success(`Xếp lịch chiếu thành công cho ngày ${newShowtime.showDate}!`);
    } catch (err) {
      toast.error(err.message || 'Lỗi xếp lịch chiếu');
    } finally {
      setSubmittingShowtime(false);
    }
  };

  if (loading) return <LoadingSpinner message="Đang tải dữ liệu quản trị..." />;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                HỆ THỐNG QUẢN TRỊ CINEPRIME
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              Bảng Điều Khiển & Quản Lý Phim
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Quản lý danh mục phim, phân loại theo thể loại, điều phối lịch chiếu và theo dõi doanh thu rạp.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors text-sm font-medium self-start md:self-auto cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới dữ liệu
          </button>
        </div>

        {/* 4 CARDS THỐNG KÊ DOANH THU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#0f1117]/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">DOANH THU ĐÃ THU</p>
                <h3 className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                  {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : 0} đ
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#0f1117]/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">TỔNG VÉ ĐÃ BÁN</p>
                <h3 className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                  {stats?.totalTicketsSold || 0} vé
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Ticket className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#0f1117]/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">TỔNG SỐ PHIM</p>
                <h3 className="text-2xl font-extrabold text-blue-400 font-mono mt-1">
                  {movies.length} phim
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Film className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#0f1117]/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">SỐ LƯỢNG THỂ LOẠI</p>
                <h3 className="text-2xl font-extrabold text-purple-400 font-mono mt-1">
                  {categories.length} thể loại
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Tag className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* TABS ĐIỀU HƯỚNG */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'movies'
                ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>Quản Lý Phim Theo Thể Loại ({movies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Quản Lý Thể Loại ({categories.length})</span>
          </button>

          <button
            onClick={() => {
              resetMovieForm();
              setActiveTab('add-movie');
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'add-movie'
                ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingMovieId ? 'Cập Nhật Phim' : 'Thêm Phim Mới'}</span>
          </button>

          <button
            onClick={() => setActiveTab('showtimes')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'showtimes'
                ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Xếp Lịch Chiếu</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('users');
              loadUsers();
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Phân Quyền & Người Dùng ({users.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: QUẢN LÝ PHIM THEO THỂ LOẠI                        */}
        {/* ======================================================== */}
        {activeTab === 'movies' && (
          <div className="space-y-6 animate-fade-in">
            {/* THANH LỌC THỂ LOẠI (GENRE FILTER PILLS) */}
            <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                  <Filter className="w-4 h-4" />
                  <span>LỌC PHIM THEO THỂ LOẠI:</span>
                </div>
                <span className="text-xs text-neutral-500 font-mono">
                  Hiển thị {filteredMovies.length} / {movies.length} phim
                </span>
              </div>

              {/* Danh sách Pill thể loại */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'ALL'
                      ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20 scale-105'
                      : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  Tất Cả ({movies.length})
                </button>

                {categories.map((cat) => {
                  const count = categoryCountMap[cat.categoryName] || 0;
                  const isSelected = selectedCategory === cat.categoryName;
                  return (
                    <button
                      key={cat.categoryId}
                      onClick={() => {
                        setSelectedCategory(cat.categoryName);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20 scale-105'
                          : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
                      }`}
                    >
                      <span>{cat.categoryName}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                          isSelected
                            ? 'bg-neutral-950/20 text-neutral-950 font-bold'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* THANH TÌM KIẾM VÀ LỌC TRẠNG THÁI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-neutral-800/80">
                <div className="relative md:col-span-2">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm phim theo tên, đạo diễn hoặc diễn viên..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-amber-400"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="NOW_SHOWING">Đang chiếu (NOW_SHOWING)</option>
                    <option value="COMING_SOON">Sắp chiếu (COMING_SOON)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DANH SÁCH BẢNG / CARDS PHIM */}
            {filteredMovies.length === 0 ? (
              <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-12 text-center">
                <Film className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-neutral-300">Không tìm thấy phim phù hợp</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Hãy thử chọn thể loại khác hoặc xóa từ khóa tìm kiếm.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedMovies.map((m) => (
                  <div
                    key={m.movieId}
                    className="bg-[#0f1117] border border-neutral-800/80 rounded-2xl p-4 flex gap-4 hover:border-neutral-700 transition-all group relative overflow-hidden"
                  >
                    {/* Poster */}
                    <img
                      src={m.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300'}
                      alt={m.movieName}
                      className="w-20 h-28 object-cover rounded-xl shrink-0 bg-neutral-900 border border-neutral-800 shadow-md"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                              m.status === 'NOW_SHOWING'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                            }`}
                          >
                            {m.status === 'NOW_SHOWING' ? 'ĐANG CHIẾU' : 'SẮP CHIẾU'}
                          </span>
                          <span className="text-neutral-500 text-xs font-mono">#{m.movieId}</span>
                        </div>

                        <h4 className="text-sm font-bold text-white truncate font-display group-hover:text-amber-400 transition-colors">
                          {m.movieName}
                        </h4>

                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {m.duration} phút • {m.releaseDate || 'Chưa rõ'}
                        </p>

                        {/* Thể loại tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {m.categories && m.categories.length > 0 ? (
                            m.categories.map((cat, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono"
                              >
                                #{cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-neutral-600 italic">Chưa gán thể loại</span>
                          )}
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-800/60">
                        <button
                          onClick={() => handleStartEditMovie(m)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-800 text-xs font-medium transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(m.movieId, m.movieName)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/20 hover:bg-rose-950/50 text-rose-400 border border-rose-900/30 text-xs font-medium transition-colors cursor-pointer ml-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PHÂN TRANG */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <span className="text-xs text-neutral-500 font-mono">
                  Trang {currentPage} / {totalPages} (Tổng số {filteredMovies.length} phim)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold font-mono px-3 py-1 bg-amber-400 text-neutral-950 rounded-lg">
                    {currentPage}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: QUẢN LÝ THỂ LOẠI (CATEGORY MANAGEMENT)            */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Cột 1: Form Thêm / Sửa Thể Loại */}
            <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-6 h-fit">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-amber-400" />
                <span>{editingCategory ? 'Chỉnh Sửa Thể Loại' : 'Thêm Thể Loại Mới'}</span>
              </h3>

              <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Tên thể loại *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Viễn tưởng, Kinh dị, Anime..."
                    value={editingCategory ? editingCategory.categoryName : newCategory.categoryName}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingCategory) {
                        setEditingCategory({ ...editingCategory, categoryName: val });
                      } else {
                        setNewCategory({ ...newCategory, categoryName: val });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Mô tả thể loại
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả ngắn gọn về đặc trưng của thể loại phim..."
                    value={editingCategory ? editingCategory.description : newCategory.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingCategory) {
                        setEditingCategory({ ...editingCategory, description: val });
                      } else {
                        setNewCategory({ ...newCategory, description: val });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingCategory}
                    className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-400/20 disabled:opacity-50"
                  >
                    {savingCategory
                      ? 'Đang xử lý...'
                      : editingCategory
                      ? 'Cập Nhật Thể Loại'
                      : 'Thêm Thể Loại'}
                  </button>

                  {editingCategory && (
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Cột 2 & 3: Bảng Danh Sách Thể Loại */}
            <div className="lg:col-span-2 bg-[#0f1117] border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>Danh Sách Thể Loại Hiện Có ({categories.length})</span>
                </h3>
                <span className="text-xs text-neutral-400 font-mono">Bảng categories CSDL</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 text-xs font-mono uppercase">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Tên Thể Loại</th>
                      <th className="py-3 px-3">Mô Tả</th>
                      <th className="py-3 px-3 text-center">Số Phim</th>
                      <th className="py-3 px-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {categories.map((cat) => {
                      const count = categoryCountMap[cat.categoryName] || 0;
                      return (
                        <tr key={cat.categoryId} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-3 font-mono text-neutral-500 text-xs">
                            #{cat.categoryId}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-white">
                            <span className="inline-flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5 text-amber-400" />
                              {cat.categoryName}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-neutral-400 text-xs max-w-xs truncate">
                            {cat.description || '—'}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-amber-400 text-xs font-mono font-bold">
                              {count} phim
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingCategory(cat)}
                                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-800 transition-colors cursor-pointer"
                                title="Chỉnh sửa thể loại"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-950/50 text-rose-400 border border-rose-900/30 transition-colors cursor-pointer"
                                title="Xóa thể loại"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: THÊM / CẬP NHẬT PHIM VỚI CHỌN NHIỀU THỂ LOẠI     */}
        {/* ======================================================== */}
        {activeTab === 'add-movie' && (
          <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-6 sm:p-8 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-white font-display">
                  {editingMovieId ? `Cập Nhật Phim: #${editingMovieId}` : 'Thêm Phim Mới Vào Rạp'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Nhập thông tin phim, chọn các thể loại phim liên kết và thiết lập trạng thái phát hành.
                </p>
              </div>

              {editingMovieId && (
                <button
                  type="button"
                  onClick={resetMovieForm}
                  className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold transition-all"
                >
                  Tạo phim mới thay vì sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                      Tên phim *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Avatar 3: Lửa & Tro Tàn..."
                      value={movieForm.movieName}
                      onChange={(e) => setMovieForm({ ...movieForm, movieName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                        Thời lượng (phút) *
                      </label>
                      <input
                        type="number"
                        required
                        value={movieForm.duration}
                        onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                        Trạng thái *
                      </label>
                      <select
                        value={movieForm.status}
                        onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="NOW_SHOWING">ĐANG CHIẾU (NOW_SHOWING)</option>
                        <option value="COMING_SOON">SẮP CHIẾU (COMING_SOON)</option>
                        <option value="ENDED">ĐÃ NGỪNG CHIẾU (ENDED)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                        Đạo diễn
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Christopher Nolan..."
                        value={movieForm.director}
                        onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                        Diễn viên
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Cillian Murphy, Tom Hardy..."
                        value={movieForm.actors}
                        onChange={(e) => setMovieForm({ ...movieForm, actors: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Poster Preview */}
                <div className="flex flex-col items-center justify-center p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
                  <span className="text-xs font-mono text-neutral-400 mb-2 uppercase">Poster Preview</span>
                  {movieForm.posterUrl ? (
                    <img
                      src={movieForm.posterUrl}
                      alt="Poster Preview"
                      className="w-28 h-40 object-cover rounded-xl border border-neutral-700 shadow-md mb-2"
                      onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300')}
                    />
                  ) : (
                    <div className="w-28 h-40 rounded-xl border border-dashed border-neutral-700 flex items-center justify-center text-neutral-600 mb-2">
                      <Film className="w-8 h-8" />
                    </div>
                  )}
                  <input
                    type="url"
                    placeholder="URL ảnh poster..."
                    value={movieForm.posterUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* CHỌN NHIỀU THỂ LOẠI (MULTI-CATEGORY SELECTION) */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    <span>CHỌN THỂ LOẠI CHO PHIM (CHỌN NHIỀU):</span>
                  </label>
                  <span className="text-xs text-neutral-400">
                    Đã chọn {movieForm.categoryIds.length} thể loại
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isChecked = movieForm.categoryIds.includes(cat.categoryId);
                    return (
                      <button
                        type="button"
                        key={cat.categoryId}
                        onClick={() => toggleCategorySelection(cat.categoryId)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                            : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-700'
                        }`}
                      >
                        {isChecked ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{cat.categoryName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Ngày khởi chiếu
                  </label>
                  <input
                    type="date"
                    value={movieForm.releaseDate}
                    onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Trailer URL (YouTube)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={movieForm.trailerUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                  Tóm tắt nội dung phim
                </label>
                <textarea
                  rows={4}
                  placeholder="Cốt truyện, bối cảnh điện ảnh và thông điệp của bộ phim..."
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-neutral-800">
                <button
                  type="submit"
                  disabled={submittingMovie}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {submittingMovie
                      ? 'Đang lưu phim...'
                      : editingMovieId
                      ? 'Cập Nhật Phim'
                      : 'Hoàn Tất Thêm Phim'}
                  </span>
                </button>

                {editingMovieId && (
                  <button
                    type="button"
                    onClick={() => {
                      resetMovieForm();
                      setActiveTab('movies');
                    }}
                    className="px-6 py-3.5 rounded-xl font-bold text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: XẾP LỊCH CHIẾU                                    */}
        {/* ======================================================== */}
        {activeTab === 'showtimes' && (
          <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl p-6 sm:p-8 animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center gap-3 pb-6 border-b border-neutral-800 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white font-display">Xếp Lịch Suất Chiếu Mới</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Tạo suất chiếu cho bộ phim tại các phòng chiếu rạp (2D, IMAX Laser, Dolby Atmos).
                </p>
              </div>
            </div>

            <form onSubmit={handleAddShowtime} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                  Chọn phim chiếu *
                </label>
                <select
                  value={newShowtime.movieId}
                  onChange={(e) => setNewShowtime({ ...newShowtime, movieId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {movies.map((m) => (
                    <option key={m.movieId} value={m.movieId}>
                      #{m.movieId} - {m.movieName} ({m.duration}p)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Phòng chiếu *
                  </label>
                  <select
                    value={newShowtime.roomId}
                    onChange={(e) => setNewShowtime({ ...newShowtime, roomId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={1}>Phòng 01 - VIP Digital (Landmark Q1)</option>
                    <option value={2}>Phòng 02 - IMAX Laser (Landmark Q1)</option>
                    <option value={3}>Phòng 03 - Dolby Atmos (Mega Mall)</option>
                    <option value={4}>Phòng 04 - Standard 2D (Mega Mall)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Định dạng chiếu *
                  </label>
                  <select
                    value={newShowtime.format}
                    onChange={(e) => setNewShowtime({ ...newShowtime, format: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="2D">Chuẩn 2D Digital</option>
                    <option value="3D">Chuẩn 3D Digital</option>
                    <option value="IMAX 2D">IMAX Laser 2D</option>
                    <option value="Dolby Atmos">Dolby Atmos Surround</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Ngày chiếu *
                  </label>
                  <input
                    type="date"
                    required
                    value={newShowtime.showDate}
                    onChange={(e) => setNewShowtime({ ...newShowtime, showDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Giờ chiếu bắt đầu *
                  </label>
                  <input
                    type="time"
                    required
                    step="1"
                    value={newShowtime.startTime}
                    onChange={(e) => setNewShowtime({ ...newShowtime, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                  Giá vé cơ bản (VNĐ) *
                </label>
                <input
                  type="number"
                  step="5000"
                  required
                  value={newShowtime.price}
                  onChange={(e) => setNewShowtime({ ...newShowtime, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submittingShowtime}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Clock className="w-4 h-4" />
                  <span>{submittingShowtime ? 'Đang xếp lịch...' : 'Tạo Suất Chiếu Này'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
        {/* ======================================================== */}
        {/* TAB 5: PHÂN QUYỀN & QUẢN LÝ NGƯỜI DÙNG (RBAC)            */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            {/* 3 Summary Cards for RBAC Roles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: ADMIN */}
              <div className="p-5 bg-gradient-to-br from-red-950/40 via-neutral-900/80 to-neutral-950 border border-red-500/30 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    Cấp cao nhất
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-extrabold text-white">
                    {users.filter((u) => u.role === 'ADMIN').length}
                  </div>
                  <div className="text-xs font-bold text-red-300 mt-1 uppercase tracking-wide">
                    Quản Trị Viên (ADMIN)
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    Toàn quyền quản trị hệ thống, quản lý doanh thu, phim, suất chiếu và phân quyền nhân sự.
                  </p>
                </div>
              </div>

              {/* Card 2: STAFF */}
              <div className="p-5 bg-gradient-to-br from-blue-950/40 via-neutral-900/80 to-neutral-950 border border-blue-500/30 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Vận hành rạp
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-extrabold text-white">
                    {users.filter((u) => u.role === 'STAFF').length}
                  </div>
                  <div className="text-xs font-bold text-blue-300 mt-1 uppercase tracking-wide">
                    Nhân Viên Rạp (STAFF)
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    Truy cập cổng soát vé (/staff/scanner), quét mã QR vé, kiểm tra trạng thái vé vào rạp.
                  </p>
                </div>
              </div>

              {/* Card 3: CUSTOMER */}
              <div className="p-5 bg-gradient-to-br from-emerald-950/40 via-neutral-900/80 to-neutral-950 border border-emerald-500/30 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Người xem phim
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-extrabold text-white">
                    {users.filter((u) => u.role === 'CUSTOMER').length}
                  </div>
                  <div className="text-xs font-bold text-emerald-300 mt-1 uppercase tracking-wide">
                    Khách Hàng (CUSTOMER)
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    Xem phim, chọn ghế rạp trực tuyến, mua combo bắp nước, thanh toán VNPAY và xem vé QR.
                  </p>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-[#0f1117] border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {['ALL', 'ADMIN', 'STAFF', 'CUSTOMER'].map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => setUserRoleFilter(roleKey)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userRoleFilter === roleKey
                        ? 'bg-amber-400 text-neutral-950 shadow-md'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {roleKey === 'ALL' ? 'Tất Cả Vai Trò' : roleKey}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, username, email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* User List Table */}
            <div className="bg-[#0f1117] border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">Danh Sách Tài Khoản & Phân Quyền Trực Tiếp</span>
                </div>
                <button
                  onClick={loadUsers}
                  disabled={loadingUsers}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Tải lại danh sách"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/80 text-neutral-400 font-mono uppercase text-[11px] border-b border-neutral-800">
                    <tr>
                      <th className="py-3.5 px-4">Người Dùng</th>
                      <th className="py-3.5 px-4">Email & Số Điện Thoại</th>
                      <th className="py-3.5 px-4 text-center">Vai Trò Hiện Tại</th>
                      <th className="py-3.5 px-4 text-center">Thay Đổi Phân Quyền (RBAC)</th>
                      <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-neutral-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-500 font-mono">
                          Không tìm thấy tài khoản nào phù hợp
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSelfAdmin = u.username === 'admin';
                        const isUpdating = updatingUserId === u.userId;
                        return (
                          <tr key={u.userId} className="hover:bg-neutral-900/50 transition-colors">
                            {/* User details */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-amber-400 shrink-0">
                                  {(u.fullName || u.username || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-sm">{u.fullName || u.username}</div>
                                  <div className="font-mono text-[11px] text-neutral-400">@{u.username} (ID: #{u.userId})</div>
                                </div>
                              </div>
                            </td>

                            {/* Email & Phone */}
                            <td className="py-3.5 px-4">
                              <div className="font-mono text-neutral-300">{u.email}</div>
                              <div className="font-mono text-[11px] text-neutral-500">{u.phone || 'Chưa cập nhật'}</div>
                            </td>

                            {/* Current Role Badge */}
                            <td className="py-3.5 px-4 text-center">
                              {u.role === 'ADMIN' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                  <ShieldAlert className="w-3 h-3" />
                                  <span>ADMIN</span>
                                </span>
                              )}
                              {u.role === 'STAFF' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  <UserCheck className="w-3 h-3" />
                                  <span>STAFF</span>
                                </span>
                              )}
                              {u.role === 'CUSTOMER' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  <Users className="w-3 h-3" />
                                  <span>CUSTOMER</span>
                                </span>
                              )}
                            </td>

                            {/* Role Switcher */}
                            <td className="py-3.5 px-4 text-center">
                              <select
                                value={u.role}
                                disabled={isSelfAdmin || isUpdating}
                                onChange={(e) => handleUpdateUserRole(u.userId, e.target.value)}
                                className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <option value="CUSTOMER">👤 Khách Hàng (CUSTOMER)</option>
                                <option value="STAFF">🎟️ Nhân Viên Soát Vé (STAFF)</option>
                                <option value="ADMIN">👑 Quản Trị Viên (ADMIN)</option>
                              </select>
                            </td>

                            {/* Status toggle */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                disabled={isSelfAdmin || isUpdating}
                                onClick={() => handleToggleUserStatus(u.userId, u.status)}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                  u.status === 'ACTIVE'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                }`}
                              >
                                {u.status === 'ACTIVE' ? '✓ Đang Hoạt Động' : '✕ Đã Khóa'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                disabled={isSelfAdmin}
                                onClick={() => handleDeleteUser(u.userId, u.username)}
                                className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                title={isSelfAdmin ? 'Không thể xóa tài khoản Admin đang đăng nhập' : 'Xóa tài khoản này'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};
