import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ProfilePage } from './features/auth/ProfilePage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { Wallet } from 'lucide-react';
import './index.css';

/**
 * Clean, production-ready Public Layout for Unauthenticated Visitors
 */
const PublicAuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const isLogin = location.pathname === '/login';

  return (
    <div className="app-wrapper">
      <div className="ambient-mesh"></div>

      {/* Modern Public Header */}
      <header className="navbar-glass">
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            paddingBottom: '16px',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'var(--text-main)',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              }}
            >
              <Wallet size={22} />
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', display: 'block' }}>
                ExpenseTracker
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                Quản lý chi tiêu thông minh
              </span>
            </div>
          </Link>

          {/* Segmented Auth Navigation Pill */}
          <nav
            style={{
              display: 'flex',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '9999px',
              border: '1px solid var(--border)',
            }}
          >
            <Link
              to="/login"
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '9999px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isLogin ? '#ffffff' : 'transparent',
                color: isLogin ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '9999px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: !isLogin ? '#ffffff' : 'transparent',
                color: !isLogin ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Đăng ký
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {children}
        </div>
      </main>

      {/* Clean Minimalist Footer */}
      <footer style={{ textAlign: 'center', padding: '24px 20px', color: 'var(--text-subtle)', fontSize: '13px' }}>
        © {new Date().getFullYear()} ExpenseTracker. Tất cả quyền được bảo lưu.
      </footer>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicAuthLayout>
            <LoginPage />
          </PublicAuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicAuthLayout>
            <RegisterPage />
          </PublicAuthLayout>
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback & Root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
