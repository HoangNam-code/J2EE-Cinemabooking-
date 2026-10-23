import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle, Film, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api';
import { useAuth } from '../store/AuthContext';
import { SocialAuthModal } from '../components/auth/SocialAuthModal';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Social Auth Modal State
  const [socialModal, setSocialModal] = useState({
    isOpen: false,
    provider: 'GOOGLE', // 'GOOGLE' | 'FACEBOOK'
  });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === '1') {
      toast.info('Phiên làm việc đã kết thúc. Vui lòng đăng nhập lại để tiếp tục.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await authApi.login(form);
      login(data);
      toast.success(`Đăng nhập thành công! Chào mừng ${data.fullName || data.username}`);
      if (data.role === 'ADMIN' || data.role === 'STAFF') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSocialModal = (provider) => {
    setError('');
    setSocialModal({
      isOpen: true,
      provider,
    });
  };

  const handleSocialLoginSuccess = async (socialData) => {
    try {
      setLoading(true);
      setError('');

      // Send social profile to backend API
      const data = await authApi.socialLogin({
        provider: socialData.provider,
        email: socialData.email,
        name: socialData.name,
        providerId: socialData.providerId || `${socialData.provider.toLowerCase()}_${Date.now()}`,
        avatarUrl: socialData.avatarUrl || '',
      });

      login(data);
      toast.success(`Đăng nhập thành công với tài khoản ${socialData.provider}! Chào mừng ${data.fullName || data.username}`);

      if (data.role === 'ADMIN' || data.role === 'STAFF') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.message || `Đăng nhập qua ${socialData.provider} thất bại`;
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Brand / Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-xl bg-amber-400 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
              <Film className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white block">
                CINE<span className="text-amber-400">PRIME</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block -mt-1">
                J2EE Cinema Experience
              </span>
            </div>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white mt-6">
            Chào Mừng Trở Lại
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Đăng nhập để đặt vé xem phim, chọn ghế rạp và ưu đãi VIP
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#12141c] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs sm:text-sm text-red-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Field */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                Tên Đăng Nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="admin, staff01, hoặc customer01"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">
                  Mật Khẩu
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Mặc định: 123456
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang Xác Thực...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Social Logins: Google & Facebook */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-800"></div>
              <span className="flex-shrink mx-4 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                Hoặc tiếp tục với
              </span>
              <div className="flex-grow border-t border-neutral-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {/* Google Login Button */}
              <button
                type="button"
                onClick={() => handleOpenSocialModal('GOOGLE')}
                disabled={loading}
                className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-neutral-500"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Facebook Login Button */}
              <button
                type="button"
                onClick={() => handleOpenSocialModal('FACEBOOK')}
                disabled={loading}
                className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-neutral-500"
              >
                <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-center text-xs text-neutral-400">
            Chưa có tài khoản CinePrime?{' '}
            <Link
              to="/register"
              className="font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
            >
              Đăng ký tài khoản mới
            </Link>
          </div>

        </div>
      </div>

      {/* Social Auth Modal */}
      <SocialAuthModal
        isOpen={socialModal.isOpen}
        provider={socialModal.provider}
        onClose={() => setSocialModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleSocialLoginSuccess}
      />
    </div>
  );
};
