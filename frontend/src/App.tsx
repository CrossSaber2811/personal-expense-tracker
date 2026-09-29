import { useState, useEffect } from 'react';
import api from './services/api';
import { RegisterPage } from './features/auth/RegisterPage';
import { AuthResponse } from './types/auth';
import './index.css';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'health' | 'register'>('register');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<HealthResponse>('/health');
      setHealth(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể kết nối đến Backend');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleRegisterSuccess = (user: AuthResponse) => {
    console.log('User registered successfully:', user);
  };

  return (
    <div className="container">
      {/* Header & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Personal Expense Tracker</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Hệ thống quản lý thu chi cá nhân</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${activeTab === 'register' ? '' : 'btn-outline'}`}
            onClick={() => setActiveTab('register')}
          >
            F01: Đăng Ký
          </button>
          <button
            className={`btn ${activeTab === 'health' ? '' : 'btn-outline'}`}
            onClick={() => setActiveTab('health')}
          >
            Health Check API
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'register' ? (
        <RegisterPage onSuccess={handleRegisterSuccess} />
      ) : (
        <div className="card">
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Kiểm tra trạng thái Backend & CSDL</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Endpoint: <code>GET /api/health</code>
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            <span>Backend:</span>
            {loading ? (
              <span className="badge badge-warning">Đang kết nối...</span>
            ) : health ? (
              <span className="badge badge-success">Spring Boot 3 ({health.status})</span>
            ) : (
              <span className="badge badge-warning" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                Offline
              </span>
            )}
          </div>

          <button className="btn" onClick={checkHealth} disabled={loading}>
            {loading ? 'Đang gửi request...' : 'Gửi lại Health Check'}
          </button>

          {health && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#f1f5f9', borderRadius: '6px' }}>
              <strong>Phản hồi từ Backend:</strong>
              <pre style={{ marginTop: '8px', fontSize: '13px' }}>
                {JSON.stringify(health, null, 2)}
              </pre>
            </div>
          )}

          {error && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b' }}>
              <strong>Lỗi:</strong> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
