import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../user/userService';
import { UserProfile } from '../../types/user';
import { ErrorResponse } from '../../types/auth';
import axios from 'axios';
import {
  User,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Mail,
  Lock,
  Wallet,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Submission feedback
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await userService.getProfile();
      setProfile(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const errData = err.response.data as ErrorResponse;
        setProfileError(errData.message || 'Không thể tải thông tin hồ sơ');
      } else {
        setProfileError('Không thể kết nối đến máy chủ');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setFieldErrors({});

    // Client-side validations
    if (!currentPassword) {
      setFieldErrors({ currentPassword: 'Vui lòng nhập mật khẩu hiện tại' });
      return;
    }

    if (!newPassword) {
      setFieldErrors({ newPassword: 'Vui lòng nhập mật khẩu mới' });
      return;
    }

    if (newPassword.length < 6) {
      setFieldErrors({ newPassword: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }

    const hasLetterAndNumber = /(?=.*[A-Za-z])(?=.*\d)/.test(newPassword);
    if (!hasLetterAndNumber) {
      setFieldErrors({ newPassword: 'Mật khẩu mới phải bao gồm cả chữ và số' });
      return;
    }

    if (newPassword === currentPassword) {
      setFieldErrors({ newPassword: 'Mật khẩu mới không được trùng với mật khẩu hiện tại' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Xác nhận mật khẩu mới không khớp' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await userService.changePassword({
        currentPassword,
        newPassword,
      });

      setSuccessMsg(res.message || 'Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as ErrorResponse;
        setErrorMsg(errorData.message || 'Đổi mật khẩu thất bại');
        if (errorData.validationErrors) {
          setFieldErrors(errorData.validationErrors);
        }
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const userInitial = profile?.username ? profile.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="app-wrapper">
      <div className="ambient-mesh"></div>

      {/* Header Bar */}
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

          <Link
            to="/dashboard"
            className="btn btn-outline"
            style={{ padding: '8px 14px', fontSize: '13px', textDecoration: 'none', gap: '6px' }}
          >
            <ArrowLeft size={16} />
            <span>Quay lại Tổng quan</span>
          </Link>
        </div>
      </header>

      {/* Profile Page Content */}
      <main className="container fade-in" style={{ flex: 1, maxWidth: '960px' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Hồ Sơ & Bảo Mật Tài Khoản
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Quản lý thông tin đăng nhập và thiết lập mật khẩu bảo vệ tài khoản
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Column 1: Profile Details Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                }}
              >
                {userInitial}
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{profile?.username || 'Đang tải...'}</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <span className="badge badge-success">Thành viên chính thức</span>
                </div>
              </div>
            </div>

            {profileLoading ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <span className="badge badge-warning">Đang đồng bộ hồ sơ...</span>
              </div>
            ) : profileError ? (
              <div className="alert alert-danger">
                <AlertCircle size={18} />
                <span>{profileError}</span>
              </div>
            ) : profile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={13} /> Mã Người Dùng (ID)
                  </label>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>#{profile.id}</div>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={13} /> Địa Chỉ Email
                  </label>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{profile.email}</div>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Shield size={13} /> Vai Trò Hệ Thống
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{profile.role}</div>
                </div>

                {profile.createdAt && (
                  <div>
                    <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} /> Ngày Tham Gia
                    </label>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>
                      {new Date(profile.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Column 2: Change Password Form Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <KeyRound size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Đổi Mật Khẩu</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Cập nhật mật khẩu mới bảo mật</p>
              </div>
            </div>

            {successMsg && (
              <div className="alert alert-success fade-in">
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger fade-in">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} noValidate>
              {/* Current Password */}
              <div className="form-group">
                <label htmlFor="current-password" className="form-label">
                  Mật khẩu hiện tại
                </label>
                <div className="input-container">
                  <span className="input-icon">
                    <Lock size={18} />
                  </span>
                  <input
                    id="current-password"
                    type={showCurrent ? 'text' : 'password'}
                    required
                    disabled={submitting}
                    className={`form-input ${fieldErrors.currentPassword ? 'has-error' : ''}`}
                    style={{ paddingRight: '42px' }}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang dùng"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.currentPassword && (
                  <div className="form-error">
                    <span>{fieldErrors.currentPassword}</span>
                  </div>
                )}
              </div>

              {/* New Password */}
              <div className="form-group">
                <label htmlFor="new-password" className="form-label">
                  Mật khẩu mới
                </label>
                <div className="input-container">
                  <span className="input-icon">
                    <KeyRound size={18} />
                  </span>
                  <input
                    id="new-password"
                    type={showNew ? 'text' : 'password'}
                    required
                    disabled={submitting}
                    className={`form-input ${fieldErrors.newPassword ? 'has-error' : ''}`}
                    style={{ paddingRight: '42px' }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự (có chữ & số)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.newPassword && (
                  <div className="form-error">
                    <span>{fieldErrors.newPassword}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label htmlFor="confirm-password" className="form-label">
                  Xác nhận mật khẩu mới
                </label>
                <div className="input-container">
                  <span className="input-icon">
                    <KeyRound size={18} />
                  </span>
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    disabled={submitting}
                    className={`form-input ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
                    style={{ paddingRight: '42px' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
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

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ width: '100%', padding: '12px' }}
              >
                {submitting ? 'Đang cập nhật mật khẩu...' : 'Cập Nhật Mật Khẩu'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
