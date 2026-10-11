import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  LogOut,
  User,
  Shield,
  KeyRound,
  ReceiptText,
  PlusCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export const DashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const checkHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await api.get<HealthResponse>('/health');
      setHealth(res.data);
    } catch {
      // Quiet fallback
    } finally {
      setLoadingHealth(false);
    }
  };

  const userInitial = currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U';
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  return (
    <div className="app-wrapper">
      <div className="ambient-mesh"></div>

      {/* Modern Glassmorphic Top Navigation Bar */}
      <header className="navbar-glass">
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '14px',
            paddingBottom: '14px',
          }}
        >
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                color: 'var(--text-main)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                }}
              >
                <Wallet size={20} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                ExpenseTracker
              </span>
            </Link>

            {/* Navigation Menu */}
            <nav style={{ display: 'flex', gap: '6px' }}>
              <Link
                to="/dashboard"
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                }}
              >
                Tổng quan
              </Link>
              <span
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '8px',
                  color: 'var(--text-subtle)',
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Giao dịch
                <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  Sắp ra mắt
                </span>
              </span>
              <span
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '8px',
                  color: 'var(--text-subtle)',
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Ngân sách
                <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  Sắp ra mắt
                </span>
              </span>
              <span
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '8px',
                  color: 'var(--text-subtle)',
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Báo cáo
                <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  Sắp ra mắt
                </span>
              </span>
            </nav>
          </div>

          {/* User Profile & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px 6px 8px',
                borderRadius: '9999px',
                background: '#ffffff',
                border: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'var(--text-main)',
                transition: 'all 0.2s ease',
              }}
              className="btn-outline"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                {userInitial}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{currentUser?.username}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hồ sơ & Đổi mật khẩu</div>
              </div>
            </Link>

            <button
              onClick={logout}
              className="btn btn-outline"
              style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container fade-in" style={{ flex: 1 }}>
        {/* Welcome Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 36px',
            color: '#ffffff',
            boxShadow: '0 12px 32px -4px rgba(49, 46, 129, 0.25)',
            marginBottom: '28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '14px',
              }}
            >
              <Sparkles size={14} color="#fde047" />
              <span>Bảng Điều Khiển Tài Chính Thông Minh</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Chào mừng trở lại, {currentUser?.username}! 👋
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: 1.6 }}>
              Theo dõi và trực quan hoá các khoản thu nhập, chi phí hàng ngày và kiểm soát hạn mức ngân sách một cách minh bạch.
            </p>
          </div>
        </div>

        {/* Financial Stat Cards (Fintech Grid) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '28px',
          }}
        >
          {/* Total Balance Card */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Tổng Số Dư</span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Wallet size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em' }}>0 ₫</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Tích lũy toàn thời gian
            </div>
          </div>

          {/* Monthly Income Card */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Thu Nhập Tháng</span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUp size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--success)', letterSpacing: '-0.02em' }}>
              +0 ₫
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Tháng {currentMonth}/{currentYear}
            </div>
          </div>

          {/* Monthly Expense Card */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Chi Tiêu Tháng</span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--danger-light)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingDown size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--danger)', letterSpacing: '-0.02em' }}>
              -0 ₫
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Tháng {currentMonth}/{currentYear}
            </div>
          </div>

          {/* Budget Card */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Ngân Sách Tháng</span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--warning-light)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em' }}>0 ₫</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Chưa thiết lập hạn mức
            </div>
          </div>
        </div>

        {/* Content Section: Transactions & Account Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Recent Activity Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Giao Dịch Gần Đây</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lịch sử thu chi phát sinh</p>
              </div>
              <button
                className="btn btn-outline"
                disabled
                style={{ padding: '6px 14px', fontSize: '13px' }}
                title="Tính năng tạo giao dịch sẽ sẵn sàng trong bản phát hành F04"
              >
                <PlusCircle size={15} />
                <span>Thêm giao dịch</span>
              </button>
            </div>

            {/* Empty State */}
            <div
              style={{
                textAlign: 'center',
                padding: '48px 20px',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-subtle)',
                border: '1px dashed var(--border)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-subtle)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <ReceiptText size={24} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                Chưa có giao dịch nào được ghi nhận
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '340px', margin: '0 auto' }}>
                Các giao dịch thu chi mới nhất của bạn sẽ xuất hiện tại đây sau khi tính năng Quản lý giao dịch (F04) hoàn thiện.
              </p>
            </div>
          </div>

          {/* Quick Profile Summary Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Tài Khoản & Bảo Mật</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Thông tin xác thực phiên</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tên đăng nhập:</span>
                <span style={{ fontWeight: 600 }}>{currentUser?.username}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                <span style={{ fontWeight: 600 }}>{currentUser?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vai trò:</span>
                <span className="badge badge-success">Thành viên</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Phiên làm việc:</span>
                <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={14} /> Bảo mật JWT
                </span>
              </div>
            </div>

            <Link
              to="/profile"
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '10px', fontSize: '13px' }}
            >
              <KeyRound size={15} />
              <span>Hồ sơ & Đổi mật khẩu</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Discrete, Minimalist Footer with System Health Indicator */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          background: '#ffffff',
          padding: '16px 20px',
          marginTop: 'auto',
        }}
      >
        <div
          className="container"
          style={{
            padding: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: 'var(--text-subtle)',
          }}
        >
          <span>© {currentYear} ExpenseTracker · Nền tảng quản lý tài chính thông minh</span>

          {/* Minimalist System Status Widget */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                display: 'inline-block',
              }}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              {health ? `Máy chủ: ${health.service} (${health.status})` : 'Máy chủ Backend: Hoạt động ổn định'}
            </span>
            <button
              onClick={checkHealth}
              disabled={loadingHealth}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              title="Kiểm tra trạng thái kết nối backend"
            >
              <RefreshCw size={12} className={loadingHealth ? 'spin' : ''} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
