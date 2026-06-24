import axios from 'axios';
import type { ApiResponse } from './types';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const res = await axiosInstance.get<T>(endpoint);
      return { success: true, data: res.data, error: null };
    } catch (err: any) {
      return {
        success: false,
        data: null as any,
        error: {
          errorCode: err.response?.status || 'API_ERROR',
          userErrorText: err.response?.data?.message || 'خطا در ارتباط با سرور',
          developerErrorText: err.message
        }
      };
    }
  },

  post: async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const res = await axiosInstance.post<T>(endpoint, data);
      return { success: true, data: res.data, error: null };
    } catch (err: any) {
      return {
        success: false,
        data: null as any,
        error: {
          errorCode: err.response?.status || 'API_ERROR',
          userErrorText: err.response?.data?.message || 'خطا در ارتباط با سرور',
          developerErrorText: err.message
        }
      };
    }
  },

  put: async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const res = await axiosInstance.put<T>(endpoint, data);
      return { success: true, data: res.data, error: null };
    } catch (err: any) {
      return {
        success: false,
        data: null as any,
        error: {
          errorCode: err.response?.status || 'API_ERROR',
          userErrorText: err.response?.data?.message || 'خطا در ارتباط با سرور',
          developerErrorText: err.message
        }
      };
    }
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const res = await axiosInstance.delete<T>(endpoint);
      return { success: true, data: res.data, error: null };
    } catch (err: any) {
      return {
        success: false,
        data: null as any,
        error: {
          errorCode: err.response?.status || 'API_ERROR',
          userErrorText: err.response?.data?.message || 'خطا در ارتباط با سرور',
          developerErrorText: err.message
        }
      };
    }
  }
};
