import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle, Film, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api';
import { useAuth } from '../store/AuthContext';

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

  const redirectAfterLogin = (data) => {
    if (data.role === 'ADMIN' || data.role === 'STAFF') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  // ===== Google Sign-In thật (Google Identity Services) =====
  const googleBtnRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);

  const handleGoogleCredential = async (response) => {
    // response.credential là Google ID Token (JWT do Google ký) -> gửi lên backend xác minh
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

  // Giữ tham chiếu mới nhất của callback để script Google luôn gọi đúng hàm
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

  return (
    <div className="min-h-[85vh] bg-[#0b0c10] flex items-center justify-center p-4 sm:p-6 text-neutral-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Logo / Title */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mb-2">
              <Film className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-wide">
              Cine<span className="text-amber-400">Prime</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Đăng nhập tài khoản để trải nghiệm điện ảnh thượng đỉnh
            </p>
          </div>

          {/* Error alert with animation */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="flex-1 leading-relaxed">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                Tên Đăng Nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="admin hoặc customer01..."
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                Mật Khẩu
              </label>
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

          {/* Social Login: Google */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-800"></div>
              <span className="flex-shrink mx-4 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                Hoặc tiếp tục với
              </span>
              <div className="flex-grow border-t border-neutral-800"></div>
            </div>

            <div className="flex flex-col items-stretch mt-3">
              {/* Google Login Button: do Google render (Google Identity Services) */}
              <div className={`relative w-full flex justify-center min-h-[44px] ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                <div ref={googleBtnRef} className="w-full flex justify-center" />
                {!googleReady && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tải Google Sign-In...</span>
                  </div>
                )}
              </div>
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
    </div>
  );
};
