import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from './authService';
import { AuthResponse, ErrorResponse } from '../../types/auth';
import axios from 'axios';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  onSuccess?: (user: AuthResponse) => void;
  onGoToLogin?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onGoToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<AuthResponse | null>(null);

  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    if (onGoToLogin) {
      onGoToLogin();
    } else {
      navigate('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});

    if (username.trim().length < 3) {
      setFieldErrors({ username: 'Tên người dùng phải từ 3 đến 50 ký tự' });
      return;
    }

    if (password.length < 6) {
      setFieldErrors({ password: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }

    const hasLetterAndNumber = /(?=.*[A-Za-z])(?=.*\d)/.test(password);
    if (!hasLetterAndNumber) {
      setFieldErrors({ password: 'Mật khẩu phải bao gồm cả chữ và số' });
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Xác nhận mật khẩu không khớp' });
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register({ username: username.trim(), email: email.trim(), password });
      setSuccessData(data);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as ErrorResponse;
        setErrorMsg(errorData.message || 'Đăng ký thất bại');
        if (errorData.validationErrors) {
          setFieldErrors(errorData.validationErrors);
        }
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="card fade-in" style={{ padding: '36px 32px', textAlign: 'center' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '2px solid var(--success-border)',
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
          Đăng Ký Thành Công!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
          Tài khoản <strong>{successData.username}</strong> ({successData.email}) đã được khởi tạo. Bạn có thể đăng nhập ngay bây giờ.
        </p>

        <button
          className="btn btn-primary"
          onClick={handleNavigateToLogin}
          style={{ width: '100%', padding: '12px' }}
        >
          Đến Trang Đăng Nhập
        </button>
      </div>
    );
  }

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
          <UserPlus size={26} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Tạo Tài Khoản Mới
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Bắt đầu quản lý tài chính thông minh ngay hôm nay
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
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="register-username" className="form-label">
            Tên người dùng
          </label>
          <div className="input-container">
            <span className="input-icon">
              <User size={18} />
            </span>
            <input
              id="register-username"
              type="text"
              required
              className={`form-input ${fieldErrors.username ? 'has-error' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="vd: dangvu"
            />
          </div>
          {fieldErrors.username && (
            <div className="form-error">
              <span>{fieldErrors.username}</span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="register-email" className="form-label">
            Địa chỉ Email
          </label>
          <div className="input-container">
            <span className="input-icon">
              <Mail size={18} />
            </span>
            <input
              id="register-email"
              type="email"
              required
              className={`form-input ${fieldErrors.email ? 'has-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vd: dang@gmail.com"
            />
          </div>
          {fieldErrors.email && (
            <div className="form-error">
              <span>{fieldErrors.email}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="register-password" className="form-label">
            Mật khẩu
          </label>
          <div className="input-container">
            <span className="input-icon">
              <Lock size={18} />
            </span>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              required
              className={`form-input ${fieldErrors.password ? 'has-error' : ''}`}
              style={{ paddingRight: '42px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự (có chữ & số)"
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

        {/* Confirm Password Field */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="register-confirm-password" className="form-label">
            Xác nhận mật khẩu
          </label>
          <div className="input-container">
            <span className="input-icon">
              <Lock size={18} />
            </span>
            <input
              id="register-confirm-password"
              type={showConfirm ? 'text' : 'password'}
              required
              className={`form-input ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
              style={{ paddingRight: '42px' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
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
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <div className="form-error">
              <span>{fieldErrors.confirmPassword}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px' }}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
              <span>Đang tạo tài khoản...</span>
            </>
          ) : (
            'Đăng Ký Tài Khoản'
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
        Đã có tài khoản?{' '}
        <Link
          to="/login"
          style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};
