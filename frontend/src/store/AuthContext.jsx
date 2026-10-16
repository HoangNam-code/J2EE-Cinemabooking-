import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    // Đồng bộ trạng thái đăng nhập tự động giữa các tab trình duyệt
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        const u = localStorage.getItem('user');
        const t = localStorage.getItem('token');
        if (u && t) {
          try {
            setUser(JSON.parse(u));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (authData) => {
    localStorage.setItem('token', authData.token);
    const userData = {
      userId: authData.userId,
      username: authData.username,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'ADMIN' || user?.role === 'STAFF' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
