import api from '../../services/api';
import { RegisterRequest, AuthResponse } from '../../types/auth';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};
