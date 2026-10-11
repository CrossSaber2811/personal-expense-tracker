import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthResponse, LoginRequest } from '../types/auth';
import { authService } from '../features/auth/authService';

interface AuthContextType {
  currentUser: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Helper to safely check if a JWT token has expired
 */
function isTokenExpired(jwtToken: string): boolean {
  try {
    const parts = jwtToken.split('.');
    if (parts.length !== 3) {
      return true;
    }
    // Decode payload (URL-safe base64)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    if (!parsed.exp) {
      return false;
    }
    // exp is in seconds, convert to milliseconds
    return parsed.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
  }, []);

  // Restore authentication state on page mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        if (isTokenExpired(storedToken)) {
          // Token has expired; clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setCurrentUser(null);
        } else {
          setToken(storedToken);
          setCurrentUser(JSON.parse(storedUser));
        }
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle unauthorized events dispatched by API response interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const res = await authService.login(credentials);

    if (res.token) {
      const user: AuthUser = {
        id: res.id,
        username: res.username,
        email: res.email,
        role: res.role,
      };

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(res.token);
      setCurrentUser(user);
    }

    return res;
  };

  const isAuthenticated = !!token && !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
