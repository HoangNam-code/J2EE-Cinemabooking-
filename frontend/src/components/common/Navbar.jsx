import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Ticket, Search, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0c10]/95 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="group flex items-center gap-2.5 focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 transition-colors">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-display tracking-wider text-white group-hover:text-amber-400 transition-colors">
                CINEPRIME
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `transition-colors pb-1 border-b-2 ${
                isActive
                  ? 'text-amber-400 border-amber-400 font-semibold'
                  : 'text-neutral-300 hover:text-white border-transparent'
              }`
            }
          >
            Trang Chủ
          </NavLink>

          <a
            href="/#now-showing"
            className="text-neutral-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent"
          >
            Phim Đang Chiếu
          </a>

          <a
            href="/#coming-soon"
            className="text-neutral-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent"
          >
            Phim Sắp Chiếu
          </a>

          <a
            href="/#formats"
            className="text-neutral-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent"
          >
            Chuẩn Trình Chiếu
          </a>

          {/* Link cho Nhân viên soát vé (Staff & Admin) */}
          {(user?.role === 'STAFF' || user?.role === 'ADMIN') && (
            <NavLink
              to="/staff/scanner"
              className={({ isActive }) =>
                `flex items-center gap-1.5 transition-colors pb-1 border-b-2 ${
                  isActive
                    ? 'text-emerald-400 border-emerald-400 font-semibold'
                    : 'text-emerald-400/90 hover:text-emerald-300 border-transparent'
                }`
              }
            >
              <Ticket className="w-4 h-4" />
              <span>Soát Vé</span>
            </NavLink>
          )}

          {/* Link cho Quản trị viên (Admin) */}
          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1.5 transition-colors pb-1 border-b-2 ${
                  isActive
                    ? 'text-amber-400 border-amber-400 font-semibold'
                    : 'text-amber-400/90 hover:text-amber-300 border-transparent'
                }`
              }
            >
              <Settings className="w-4 h-4" />
              <span>Quản Trị</span>
            </NavLink>
          )}

          {/* Seminar Demo: GraphQL IDE */}
          <a
            href="http://localhost:8088/graphiql"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/40 text-[11px] font-mono text-purple-300 hover:text-white hover:border-purple-400 transition-colors"
            title="Mở giao diện GraphiQL IDE để demo seminar Spring for GraphQL"
          >
            <span>GraphQL IDE</span>
          </a>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Bar */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 w-44 sm:w-60">
                <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Tìm phim, thể loại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                  className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
                title="Tìm kiếm phim"
                aria-label="Tìm kiếm phim"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User / My Tickets Pass Button */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/my-tickets"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                <Ticket className="w-4 h-4 text-neutral-950" />
                <span>Vé của tôi</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-neutral-200">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="max-w-[100px] truncate font-medium">
                    {user.fullName || user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-900 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/80 border border-neutral-800 rounded-lg transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 md:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-[#0b0c10]/98 px-4 py-4 space-y-3">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-neutral-200 hover:text-amber-400 hover:bg-neutral-900/60 rounded-lg transition-colors"
          >
            Trang Chủ
          </NavLink>
          <a
            href="/#now-showing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-neutral-200 hover:text-amber-400 hover:bg-neutral-900/60 rounded-lg transition-colors"
          >
            Phim Đang Chiếu
          </a>
          <a
            href="/#coming-soon"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-neutral-200 hover:text-amber-400 hover:bg-neutral-900/60 rounded-lg transition-colors"
          >
            Phim Sắp Chiếu
          </a>
          <a
            href="/#formats"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-neutral-200 hover:text-amber-400 hover:bg-neutral-900/60 rounded-lg transition-colors"
          >
            Chuẩn Trình Chiếu
          </a>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-amber-400 hover:bg-neutral-900/60 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Quản Trị Hệ Thống</span>
            </Link>
          )}

          <div className="pt-3 border-t border-neutral-800/80 space-y-2">
            {user ? (
              <>
                <Link
                  to="/my-tickets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Vé của tôi</span>
                </Link>
                <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/60 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-neutral-200">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>{user.fullName || user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
