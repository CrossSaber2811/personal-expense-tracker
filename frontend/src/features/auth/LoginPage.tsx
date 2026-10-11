import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorResponse } from '../../types/auth';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle, HelpCircle, X } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFieldErrors((prev) => ({ ...prev, email: 'Vui lòng nhập địa chỉ email' }));
      return;
    }
    if (!password) {
      setFieldErrors((prev) => ({ ...prev, password: 'Vui lòng nhập mật khẩu' }));
      return;
    }

    setLoading(true);
    try {
      await login({ email: trimmedEmail, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as ErrorResponse;
        setErrorMsg(errorData.message || 'Email hoặc mật khẩu không chính xác');
        if (errorData.validationErrors) {
          setFieldErrors(errorData.validationErrors);
        }
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in" style={{ padding: '36px 32px' }}>
      {/* Form Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
          }}
        >
          <LogIn size={26} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Đăng Nhập Tài Khoản
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Chào mừng quay trở lại với ExpenseTracker
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="alert alert-danger fade-in">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            Địa chỉ Email
          </label>
          <div className="input-container">
            <span className="input-icon">
              <Mail size={18} />
            </span>
            <input
              id="login-email"
              type="email"
              required
              autoFocus
              className={`form-input ${fieldErrors.email ? 'has-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@example.com"
            />
          </div>
          {fieldErrors.email && (
            <div className="form-error">
              <span>{fieldErrors.email}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label htmlFor="login-password" className="form-label" style={{ marginBottom: 0 }}>
              Mật khẩu
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="input-container">
            <span className="input-icon">
              <Lock size={18} />
            </span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              className={`form-input ${fieldErrors.password ? 'has-error' : ''}`}
              style={{ paddingRight: '42px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--text-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && (
            <div className="form-error">
              <span>{fieldErrors.password}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '14px', padding: '12px' }}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
              <span>Đang xác thực...</span>
            </>
          ) : (
            'Đăng Nhập'
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
        >
          Đăng ký tài khoản mới
        </Link>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="card fade-in"
            style={{ maxWidth: '420px', width: '100%', padding: '24px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
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
                <HelpCircle size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Hỗ Trợ Khôi Phục Mật Khẩu</h3>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Hệ thống hiện tại quản lý bảo mật qua cơ chế <strong>Đổi mật khẩu trong trang Hồ sơ</strong> sau khi đăng nhập.
              <br /><br />
              Nếu bạn không nhớ mật khẩu của tài khoản hiện tại, bạn có thể tạo một tài khoản mới bất kỳ qua trang <strong>Đăng ký</strong> để tiếp tục sử dụng hệ thống.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-outline"
                onClick={() => setShowForgotModal(false)}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Đóng
              </button>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={() => setShowForgotModal(false)}
                style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}
              >
                Tạo tài khoản mới
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
