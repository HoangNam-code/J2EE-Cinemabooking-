import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Film, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  UserCheck, 
  KeyRound, 
  CheckCircle2, 
  RefreshCw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api';
import { useAuth } from '../store/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 'form' | 'otp'
  const [step, setStep] = useState('form');

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer for resending OTP
  useEffect(() => {
    let timer;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const validateForm = () => {
    const errs = {};
    if (!form.fullName.trim()) {
      errs.fullName = 'Vui lòng nhập họ và tên';
    }
    if (!form.username.trim()) {
      errs.username = 'Vui lòng nhập tên đăng nhập';
    } else if (form.username.length < 3) {
      errs.username = 'Tên đăng nhập tối thiểu 3 ký tự';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errs.email = 'Vui lòng nhập địa chỉ email';
    } else if (!emailRegex.test(form.email.trim())) {
      errs.email = 'Email không hợp lệ (ví dụ: user@example.com)';
    }

    const phoneRegex = /^0\d{9}$/;
    if (!form.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(form.phone.trim().replace(/\s+/g, ''))) {
      errs.phone = 'Số điện thoại VN không hợp lệ (bắt đầu bằng 0, gồm 10 số)';
    }

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

  // Step 1: Send OTP to Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const resData = await authApi.sendRegisterOtp({
        email: form.email.trim(),
        username: form.username.trim(),
        fullName: form.fullName.trim(),
      });

      if (resData && typeof resData === 'string' && resData.length === 6) {
        setDevOtpHint(resData);
      }

      setStep('otp');
      setCountdown(60);
      toast.success(`Mã xác thực OTP đã được tạo cho email ${form.email.trim()}!`);
    } catch (err) {
      const msg = err.message || 'Không thể gửi mã xác thực. Vui lòng kiểm tra lại thông tin';
      setGeneralError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;

    try {
      setResending(true);
      setGeneralError('');
      const resData = await authApi.sendRegisterOtp({
        email: form.email.trim(),
        username: form.username.trim(),
        fullName: form.fullName.trim(),
      });

      if (resData && typeof resData === 'string' && resData.length === 6) {
        setDevOtpHint(resData);
      }

      setCountdown(60);
      toast.success(`Đã tạo mã xác thực mới cho ${form.email.trim()}!`);
    } catch (err) {
      const msg = err.message || 'Gửi lại mã OTP thất bại';
      setGeneralError(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  // Step 2: Verify OTP & Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!otp.trim() || otp.trim().length < 6) {
      setGeneralError('Vui lòng nhập đầy đủ mã xác thực OTP gồm 6 chữ số');
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
        otp: otp.trim(),
      };

      const data = await authApi.register(payload);
      // Auto login
      login(data);
      toast.success(`Chúc mừng ${data.fullName || data.username}, bạn đã đăng ký tài khoản thành công!`);
      navigate('/');
    } catch (err) {
      const msg = err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn';
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
              {step === 'form' ? (
                <>Đăng Ký <span className="text-amber-400">Tài Khoản</span></>
              ) : (
                <>Xác Thực <span className="text-amber-400">Email</span></>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              {step === 'form'
                ? 'Nhận đặc quyền thành viên và ưu đãi xem phim tại CinePrime'
                : `Nhập mã xác thực 6 chữ số đã được gửi đến ${form.email}`}
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
              step === 'form' ? 'bg-amber-400 text-neutral-950' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {step === 'otp' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>1</span>}
              <span>Thông Tin</span>
            </div>
            <div className="w-6 h-0.5 bg-neutral-800" />
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
              step === 'otp' ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-500'
            }`}>
              <span>2</span>
              <span>Xác Thực OTP</span>
            </div>
          </div>

          {/* General error banner */}
          {generalError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="flex-1 leading-relaxed">{generalError}</span>
            </div>
          )}

          {/* ================= STEP 1: FORM THÔNG TIN ================= */}
          {step === 'form' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                  Họ và Tên *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Đặng Hoàng Nam"
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
                  Tên Đăng Nhập *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Tối thiểu 3 ký tự (ví dụ: namcine)"
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

              {/* Email & Phone 2-columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                    Email nhận mã OTP *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="ban@gmail.com"
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
                    Số Điện Thoại *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="0901234567"
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
                    Mật Khẩu *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
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
                    Nhập Lại Mật Khẩu *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
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

              {/* Submit Button Step 1 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang Gửi Mã Xác Thực Về Email...</span>
                  </>
                ) : (
                  <>
                    <span>Tiếp Tục & Gửi Mã Xác Thực</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* ================= STEP 2: NHẬP MÃ OTP ================= */
            <form onSubmit={handleVerifyAndRegister} className="space-y-5 animate-fade-in">
              <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 animate-bounce" />
                </div>
                <div className="text-xs text-neutral-400">
                  Mã OTP 6 chữ số đã được gửi tới địa chỉ email:
                </div>
                <div className="text-sm font-bold text-amber-400 font-mono">
                  {form.email}
                </div>
              </div>



              {/* OTP Input */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase tracking-wider text-center">
                  Nhập mã xác thực OTP (6 chữ số)
                </label>
                <div className="relative max-w-xs mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[12px] font-mono text-2xl py-3 px-4 bg-neutral-900 border-2 border-neutral-700 focus:border-amber-400 rounded-2xl text-white outline-none transition-all placeholder:text-neutral-700"
                  />
                </div>
                <p className="mt-2 text-center text-[11px] text-neutral-500 font-mono">
                  Mã có hiệu lực trong vòng 5 phút
                </p>
              </div>

              {/* Submit Button Step 2 */}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang Xác Thực & Tạo Tài Khoản...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận & Hoàn Tất Đăng Ký</span>
                  </>
                )}
              </button>

              {/* Action buttons: Resend & Back */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Sửa thông tin</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || resending}
                  className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                    countdown > 0 ? 'text-neutral-500 cursor-not-allowed' : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>
                    {countdown > 0 ? `Gửi lại mã (${countdown}s)` : 'Gửi lại mã OTP'}
                  </span>
                </button>
              </div>

            </form>
          )}

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
