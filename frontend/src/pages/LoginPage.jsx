import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle, Film, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api';
import { useAuth } from '../store/AuthContext';
import { SocialAuthModal } from '../components/auth/SocialAuthModal';

const GOOGLE_GSI_SRC = 'https://accounts.google.com/gsi/client';

// Nạp script Google Identity Services một lần duy nhất
const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    let script = document.querySelector(`script[src="${GOOGLE_GSI_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = GOOGLE_GSI_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Không tải được Google Sign-In')));
  });

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Social Auth Modal State (Facebook & Fallback)
  const [socialModal, setSocialModal] = useState({
    isOpen: false,
    provider: 'FACEBOOK', // 'GOOGLE' | 'FACEBOOK'
  });

  const redirectAfterLogin = (data) => {
    if (data.role === 'ADMIN' || data.role === 'STAFF') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

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
      redirectAfterLogin(data);
    } catch (err) {
      const msg = err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ===== Google Sign-In thật (Google Identity Services) =====
  const googleBtnRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);

  const handleGoogleCredential = async (response) => {
    try {
      setLoading(true);
      setError('');
      const data = await authApi.googleLogin(response.credential);
      login(data);
      toast.success(`Đăng nhập Google thành công! Chào mừng ${data.fullName || data.username}`);
      redirectAfterLogin(data);
    } catch (err) {
      const msg = err.message || 'Đăng nhập bằng Google thất bại';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const googleCallbackRef = useRef(handleGoogleCredential);
  googleCallbackRef.current = handleGoogleCredential;

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const { clientId } = await authApi.getGoogleConfig();
        if (!clientId) {
          console.warn('Chưa cấu hình GOOGLE_CLIENT_ID ở backend');
          return;
        }
        await loadGoogleScript();
        if (cancelled || !googleBtnRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (res) => googleCallbackRef.current(res),
          ux_mode: 'popup',
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
          locale: 'vi',
          width: Math.min(googleBtnRef.current.offsetWidth || 320, 400),
        });
        setGoogleReady(true);
      } catch (err) {
        console.error('Không khởi tạo được Google Sign-In:', err);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

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

      const data = await authApi.socialLogin({
        provider: socialData.provider,
        email: socialData.email,
        name: socialData.name,
        providerId: socialData.providerId || `${socialData.provider.toLowerCase()}_${Date.now()}`,
        avatarUrl: socialData.avatarUrl || '',
      });

      login(data);
      toast.success(`Đăng nhập thành công với tài khoản ${socialData.provider}! Chào mừng ${data.fullName || data.username}`);
      redirectAfterLogin(data);
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

          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-800"></div>
              <span className="flex-shrink mx-4 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                Hoặc tiếp tục với
              </span>
              <div className="flex-grow border-t border-neutral-800"></div>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              {/* Google Sign-In Button (Official Google Identity Services) */}
              <div className={`relative w-full flex justify-center min-h-[44px] ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                <div ref={googleBtnRef} className="w-full flex justify-center" />
                {!googleReady && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tải Google Sign-In...</span>
                  </div>
                )}
              </div>

              {/* Facebook Login Button */}
              <button
                type="button"
                onClick={() => handleOpenSocialModal('FACEBOOK')}
                disabled={loading}
                className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-full text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-neutral-500"
              >
                <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Đăng nhập với Facebook</span>
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

export default LoginPage;
