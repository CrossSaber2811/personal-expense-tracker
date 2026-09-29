import React, { useState } from 'react';
import { authService } from './authService';
import { AuthResponse, ErrorResponse } from '../../types/auth';
import axios from 'axios';

interface RegisterPageProps {
  onSuccess?: (user: AuthResponse) => void;
  onGoToLogin?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onGoToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<AuthResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});

    // Client-side quick checks
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Xác nhận mật khẩu không khớp' });
      return;
    }

    if (password.length < 6) {
      setFieldErrors({ password: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register({ username, email, password });
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
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="card" style={{ maxWidth: '440px', margin: '40px auto' }}>
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <div className="badge badge-success" style={{ fontSize: '16px', padding: '8px 16px', marginBottom: '16px' }}>
            ✓ Đăng ký thành công!
          </div>
          <p style={{ marginBottom: '8px' }}>
            Chào mừng thành viên mới: <strong>{successData.username}</strong>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
            Email đăng ký: {successData.email}
          </p>
          {onGoToLogin ? (
            <button className="btn" onClick={onGoToLogin} style={{ width: '100%' }}>
              Đi đến Đăng nhập (F02)
            </button>
          ) : (
            <button className="btn" onClick={() => setSuccessData(null)} style={{ width: '100%' }}>
              Tạo tài khoản khác
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '440px', margin: '40px auto' }}>
      <h2 style={{ fontSize: '22px', marginBottom: '6px', textAlign: 'center' }}>Đăng Ký Tài Khoản</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
        Tạo tài khoản cá nhân để quản lý thu chi
      </p>

      {errorMsg && (
        <div style={{ padding: '12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', marginBottom: '16px', fontSize: '14px' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
            Tên người dùng (3–50 ký tự)
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="vd: dangvu"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${fieldErrors.username ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          {fieldErrors.username && (
            <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {fieldErrors.username}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
            Địa chỉ Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vd: dang@gmail.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${fieldErrors.email ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          {fieldErrors.email && (
            <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
            Mật khẩu (ít nhất 6 ký tự, có chữ và số)
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${fieldErrors.password ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          {fieldErrors.password && (
            <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {fieldErrors.password}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${fieldErrors.confirmPassword ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          {fieldErrors.confirmPassword && (
            <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {fieldErrors.confirmPassword}
            </span>
          )}
        </div>

        <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
        </button>
      </form>

      {onGoToLogin && (
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Đăng nhập
          </button>
        </div>
      )}
    </div>
  );
};
