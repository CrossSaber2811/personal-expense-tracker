import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token to authenticated requests only
api.interceptors.request.use(
  (config) => {
    const isPublicAuth =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register');

    const token = localStorage.getItem('token');
    if (token && !isPublicAuth && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 responses gracefully without loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      // If 401 occurred on an authenticated request (not login), token is expired/invalid
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
