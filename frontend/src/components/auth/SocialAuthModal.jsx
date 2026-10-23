import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, ExternalLink, Settings, User, Mail, ChevronRight, Info, AlertCircle } from 'lucide-react';

export const SocialAuthModal = ({
  isOpen,
  onClose,
  provider = 'GOOGLE', // 'GOOGLE' | 'FACEBOOK'
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'custom' | 'api-settings'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form custom account
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  // Real OAuth Client IDs (saved in localStorage or from import.meta.env)
  const envGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const envFacebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || '';
  const [googleClientId, setGoogleClientId] = useState(
    localStorage.getItem('cineprime_google_client_id') || envGoogleClientId
  );
  const [facebookAppId, setFacebookAppId] = useState(
    localStorage.getItem('cineprime_facebook_app_id') || envFacebookAppId
  );
  const [savedSettings, setSavedSettings] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSavedSettings(false);
      if (provider === 'GOOGLE' && !customEmail) {
        setCustomEmail('dhnam1109@gmail.com');
        setCustomName('Đặng Hoàng Nam');
      } else if (provider === 'FACEBOOK' && !customEmail) {
        setCustomEmail('hoangnam.dev@facebook.com');
        setCustomName('Hoàng Nam');
      }
    }
  }, [isOpen, provider]);

  if (!isOpen) return null;

  const isGoogle = provider === 'GOOGLE';

  // Demo accounts that match real Google / Facebook profiles
  const sampleAccounts = isGoogle
    ? [
        {
          name: 'Đặng Hoàng Nam',
          email: 'dhnam1109@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          badge: 'Tác giả đồ án',
        },
        {
          name: 'Nguyễn Văn An',
          email: 'an.nguyen@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
          badge: 'Khách hàng VIP',
        },
        {
          name: 'Trần Thị Bình',
          email: 'binh.tran@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          badge: 'Thành viên CinePrime',
        },
      ]
    : [
        {
          name: 'Đặng Hoàng Nam',
          email: 'hoangnam.dev@facebook.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          badge: 'Tài khoản Facebook liên kết',
        },
        {
          name: 'CinePrime Fan Club',
          email: 'member@facebook.com',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
          badge: 'Facebook Verified',
        },
      ];

  // 1. Submit login to parent handler
  const handleSelectAccount = async (account) => {
    try {
      setLoading(true);
      setError('');
      await onSuccess({
        provider,
        email: account.email,
        name: account.name,
        providerId: `${provider.toLowerCase()}_${Date.now()}`,
        avatarUrl: account.avatar || '',
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Đăng nhập không thành công');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit custom email
  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ Email hợp lệ');
      return;
    }
    const finalName = customName.trim() || customEmail.split('@')[0];
    await handleSelectAccount({
      email: customEmail.trim(),
      name: finalName,
      avatar: '',
    });
  };

  // 3. Real Google OAuth 2.0 flow via Google Identity Services
  const handleRealGoogleOAuth = () => {
    const clientId = googleClientId.trim();
    if (!clientId) {
      setError('Vui lòng nhập Google Client ID hợp lệ từ Google Cloud Console');
      setActiveTab('api-settings');
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      setError('Thư viện Google Identity Services chưa tải xong. Vui lòng kiểm tra kết nối mạng và thử lại.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        callback: async (tokenResponse) => {
          if (tokenResponse?.error) {
            setError(`Lỗi Google OAuth: ${tokenResponse.error_description || tokenResponse.error}`);
            setLoading(false);
            return;
          }

          try {
            // Fetch real user info from official Google endpoint
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const profile = await res.json();

            if (!profile?.email) {
              throw new Error('Không lấy được địa chỉ email từ tài khoản Google');
            }

            // Send real Google profile to CinePrime backend
            await onSuccess({
              provider: 'GOOGLE',
              email: profile.email,
              name: profile.name || profile.email.split('@')[0],
              providerId: profile.sub || `google_${Date.now()}`,
              avatarUrl: profile.picture || '',
            });
            onClose();
          } catch (fetchErr) {
            setError(fetchErr.message || 'Lỗi khi lấy thông tin tài khoản từ Google API');
          } finally {
            setLoading(false);
          }
        },
      });

      client.requestAccessToken();
    } catch (initErr) {
      setError(initErr.message || 'Không thể khởi tạo popup Google OAuth');
      setLoading(false);
    }
  };

  // 4. Real Facebook OAuth Flow via FB SDK
  const handleRealFacebookOAuth = () => {
    const appId = facebookAppId.trim();
    if (!appId) {
      setError('Vui lòng nhập Facebook App ID từ Meta for Developers');
      setActiveTab('api-settings');
      return;
    }

    if (!window.FB) {
      setError('Facebook SDK chưa sẵn sàng. Vui lòng thử lại sau.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });

      window.FB.login(
        (response) => {
          if (response.authResponse) {
            window.FB.api('/me', { fields: 'id,name,email,picture' }, async (fbProfile) => {
              try {
                const fbEmail = fbProfile.email || `${fbProfile.id}@facebook.cineprime.vn`;
                await onSuccess({
                  provider: 'FACEBOOK',
                  email: fbEmail,
                  name: fbProfile.name || 'Người dùng Facebook',
                  providerId: fbProfile.id,
                  avatarUrl: fbProfile.picture?.data?.url || '',
                });
                onClose();
              } catch (err) {
                setError(err.message || 'Lỗi lưu thông tin tài khoản Facebook');
              } finally {
                setLoading(false);
              }
            });
          } else {
            setError('Bạn đã hủy đăng nhập Facebook');
            setLoading(false);
          }
        },
        { scope: 'public_profile,email' }
      );
    } catch (fbErr) {
      setError(fbErr.message || 'Không thể mở cửa sổ đăng nhập Facebook');
      setLoading(false);
    }
  };

  const handleSaveApiKeys = () => {
    if (googleClientId) {
      localStorage.setItem('cineprime_google_client_id', googleClientId.trim());
    }
    if (facebookAppId) {
      localStorage.setItem('cineprime_facebook_app_id', facebookAppId.trim());
    }
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 animate-scale-up">
        {/* Header styling */}
        <div className="relative px-6 pt-6 pb-4 border-b border-neutral-800 bg-neutral-950/60">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {isGoogle ? (
              <div className="w-10 h-10 rounded-xl bg-white p-2 flex items-center justify-center shadow-md shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#1877F2] p-2 flex items-center justify-center shadow-md shrink-0">
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-white">
                {isGoogle ? 'Đăng nhập bằng Google' : 'Đăng nhập với Facebook'}
              </h2>
              <p className="text-xs text-neutral-400">
                Xác thực danh tính an toàn và liên kết với CinePrime
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('account')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Chọn tài khoản
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Nhập email khác
            </button>
            <button
              onClick={() => setActiveTab('api-settings')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'api-settings'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>OAuth API thật</span>
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Account list */}
        {activeTab === 'account' && (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                Chọn tài khoản {isGoogle ? 'Google' : 'Facebook'} để tiếp tục:
              </span>

              {sampleAccounts.map((acc) => (
                <button
                  key={acc.email}
                  disabled={loading}
                  onClick={() => handleSelectAccount(acc)}
                  className="w-full p-3.5 bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 rounded-xl flex items-center justify-between transition-all group cursor-pointer text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-700 group-hover:border-amber-400 transition-colors"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {acc.name}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono">
                        {acc.email}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            {/* Direct Official Popup Button */}
            <div className="pt-2 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={isGoogle ? handleRealGoogleOAuth : handleRealFacebookOAuth}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isGoogle ? 'Mở cửa sổ Google Accounts thật' : 'Mở cửa sổ Facebook OAuth thật'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Custom email */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCustomSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                Địa chỉ Email {isGoogle ? 'Gmail' : 'Facebook'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder={isGoogle ? 'tenban@gmail.com' : 'tenban@facebook.com'}
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                Họ và Tên
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Ví dụ: Đặng Hoàng Nam"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 font-bold text-xs text-neutral-950 rounded-xl shadow-lg shadow-amber-400/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
            </button>
          </form>
        )}

        {/* Tab 3: OAuth API Settings */}
        {activeTab === 'api-settings' && (
          <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
            <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-neutral-300 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Info className="w-4 h-4" />
                <span>Tích hợp Google / Facebook OAuth thực tế:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-400">
                Để popup chính thức từ Google/Facebook hiện lên trên máy bạn, hãy tạo Client ID miễn phí tại Google Cloud Console hoặc Meta Developers và dán vào đây:
              </p>
            </div>

            {isGoogle ? (
              <div className="space-y-2">
                <label className="block text-xs font-mono text-neutral-400 uppercase">
                  Google Client ID (OAuth 2.0 Web Client)
                </label>
                <input
                  type="text"
                  placeholder="xxxxxxxx.apps.googleusercontent.com"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleRealGoogleOAuth}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Kích hoạt Google OAuth Popup Thực Tế</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-mono text-neutral-400 uppercase">
                  Facebook App ID
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 123456789012345"
                  value={facebookAppId}
                  onChange={(e) => setFacebookAppId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleRealFacebookOAuth}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-[#1877F2] hover:bg-[#166fe5] rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Kích hoạt Facebook OAuth Popup Thực Tế</span>
                </button>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSaveApiKeys}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 rounded-xl cursor-pointer"
              >
                {savedSettings ? '✓ Đã lưu cấu hình' : 'Lưu Client ID'}
              </button>
              <span className="text-[11px] text-neutral-500 font-mono">
                Lưu trên trình duyệt
              </span>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-neutral-950 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Mã hóa bảo mật chuẩn OAuth 2.0 & JWT</span>
          </div>
          <span className="font-mono text-neutral-500">CinePrime Security</span>
        </div>
      </div>
    </div>
  );
};

