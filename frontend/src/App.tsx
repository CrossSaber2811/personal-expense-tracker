import { useState, useEffect } from 'react';
import api from './services/api';
import './index.css';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export default function App() {
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

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
          Personal Expense Tracker
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Hệ thống Quản lý Thu Chi Cá Nhân — Project Skeleton & Baseline Verification
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
          <span>Frontend:</span>
          <span className="badge badge-success">Vite + React (Running)</span>
          
          <span style={{ marginLeft: '12px' }}>Backend API:</span>
          {loading ? (
            <span className="badge badge-warning">Đang kiểm tra...</span>
          ) : health ? (
            <span className="badge badge-success">Spring Boot 3 ({health.status})</span>
          ) : (
            <span className="badge badge-warning" style={{ background: '#fee2e2', color: '#b91c1c' }}>
              Chưa kết nối ({error || 'Off'})
            </span>
          )}
        </div>

        <button className="btn" onClick={checkHealth} disabled={loading}>
          {loading ? 'Đang gửi request...' : 'Kiểm tra kết nối Backend (GET /api/health)'}
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
            <strong>Lỗi kết nối:</strong> {error}
            <p style={{ fontSize: '12px', marginTop: '6px', color: '#7f1d1d' }}>
              * Gợi ý: Hãy khởi chạy backend bằng lệnh <code>mvn spring-boot:run</code> tại thư mục <code>backend/</code>.
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Tiến độ các giai đoạn (Roadmap)</h2>
        <ul style={{ listStyleType: 'none', lineHeight: '2' }}>
          <li>✅ <strong>Phase 0:</strong> Project Specification (Requirements, DB, Architecture, Feature Map)</li>
          <li>✅ <strong>Phase 1:</strong> Project Skeleton (Git init, Backend Spring Boot 3, Frontend React Vite, Health Check)</li>
          <li>⏳ <strong>Phase 2:</strong> Database & Backend Foundation (PostgreSQL connection, Exception Handling)</li>
          <li>⏳ <strong>Phase 3:</strong> Authentication (F01 Register, F02 Login / JWT, F03 Password)</li>
          <li>⏳ <strong>Phase 4:</strong> Transaction Management (F04 CRUD, Filter, Validation, IDOR)</li>
        </ul>
      </div>
    </div>
  );
}
