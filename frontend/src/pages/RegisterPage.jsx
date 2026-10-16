import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, Film, Sparkles, Loader2, ArrowRight, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api';
import { useAuth } from '../store/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) {
      errs.fullName = 'Vui lòng nhập họ và tên';
    }
    if (!form.username.trim()) {
      errs.username = 'Vui lòng nhập tên đăng nhập';
    } else if (form.username.length < 3) {
      errs.username = 'Tên đăng nhập tối thiểu 3 ký tự';
    }

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errs.email = 'Vui lòng nhập địa chỉ email';
    } else if (!emailRegex.test(form.email.trim())) {
      errs.email = 'Email không hợp lệ (ví dụ: user@example.com)';
    }

    // VN Phone regex: starts with 0 and has 10 digits
    const phoneRegex = /^0\d{9}$/;
    if (!form.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(form.phone.trim().replace(/\s+/g, ''))) {
      errs.phone = 'Số điện thoại VN không hợp lệ (bắt đầu bằng số 0, gồm 10 chữ số)';
    }

    // Password validation
    if (!form.password) {
      errs.password = 'Vui lòng nhập mật khẩu';
    } else if (form.password.length < 6) {
      errs.password = 'Mật khẩu phải từ 6 ký tự trở lên';
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim().replace(/\s+/g, ''),
        password: form.password,
      };

      const data = await authApi.register(payload);
      // Auto-login after successful registration
      login(data);
      toast.success('Đăng ký tài khoản CinePrime thành công! Đã tự động đăng nhập.');
      navigate('/');
    } catch (err) {
      const msg = err.message || 'Đăng ký tài khoản không thành công. Vui lòng thử lại';
      setGeneralError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#0b0c10] flex items-center justify-center p-4 sm:p-6 text-neutral-100 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Logo / Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mb-1">
              <Film className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-wide">
              Đăng Ký <span className="text-amber-400">Tài Khoản</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Nhận đặc quyền thành viên và tích điểm đổi quà tại CinePrime
            </p>
          </div>

          {/* General error message */}
          {generalError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="flex-1 leading-relaxed">{generalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                Họ và Tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <UserCheck className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 bg-neutral-900 border rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                    errors.fullName ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                Tên Đăng Nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="nguyenvana"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 bg-neutral-900 border rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                    errors.username ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.username}</p>
              )}
            </div>

            {/* Email & Phone 2-columns on sm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-900 border rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                  Số Điện Thoại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-900 border rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                  Mật Khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 6 ký tự"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full pl-10 pr-9 py-2.5 bg-neutral-900 border rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                      errors.password ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                  Nhập Lại Mật Khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận mật khẩu"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className={`w-full pl-10 pr-9 py-2.5 bg-neutral-900 border rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                      errors.confirmPassword ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.confirmPassword}</p>
                )}
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
                  <span>Đang Tạo Tài Khoản...</span>
                </>
              ) : (
                <>
                  <span>Đăng Ký Tài Khoản</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Login Link */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-center text-xs text-neutral-400">
            Đã có tài khoản CinePrime?{' '}
            <Link
              to="/login"
              className="font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
