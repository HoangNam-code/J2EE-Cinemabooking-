import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { MovieDetailPage } from '../pages/MovieDetailPage';
import { BookingSeatPage } from '../pages/BookingSeatPage';
import { BookingComboPage } from '../pages/BookingComboPage';
import { PaymentPage } from '../pages/PaymentPage';
import { PaymentResultPage } from '../pages/PaymentResultPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MyTicketsPage } from '../pages/MyTicketsPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { StaffTicketScannerPage } from '../pages/StaffTicketScannerPage';
import { useAuth } from '../store/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Protected Route for Authenticated Users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Đang kiểm tra phiên đăng nhập..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Protected Route for Admins only
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Đang xác thực quyền quản trị..." />;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected Route for Staff & Admins (Soát vé & Vận hành rạp)
const StaffRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Đang kiểm tra quyền nhân viên..." />;
  }

  if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route
        path="/booking/:showtimeId/seats"
        element={
          <ProtectedRoute>
            <BookingSeatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/combo"
        element={
          <ProtectedRoute>
            <BookingComboPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:bookingId"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route path="/payment-result" element={<PaymentResultPage />} />
      <Route
        path="/my-tickets"
        element={
          <ProtectedRoute>
            <MyTicketsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/staff/scanner"
        element={
          <StaffRoute>
            <StaffTicketScannerPage />
          </StaffRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
