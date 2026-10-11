import api from '../../services/api';
import { UserProfile, ChangePasswordRequest, MessageResponse } from '../../types/user';

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/users/me');
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<MessageResponse> => {
    const response = await api.put<MessageResponse>('/users/me/password', data);
    return response.data;
  },
};
