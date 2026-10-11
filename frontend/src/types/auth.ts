export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  type?: string;
  expiresIn?: number;
  id: number;
  username: string;
  email: string;
  role: string;
  message: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}
