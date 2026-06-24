import { api } from '../../../lib/api/baseApi';
import type { LoginCredentials, LoginResponse } from '../model/types';
import type { ApiResponse } from '../../../lib/api/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const res = await api.post<LoginResponse>('/login', credentials);
    if (res.success && res.data?.token) {
      localStorage.setItem('auth_token', res.data.token);
    }
    return res;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
  }
};

