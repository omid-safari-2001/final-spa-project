import { api } from '../../../lib/api/baseApi';
import type { ApiResponse } from '../../../lib/api/types';
import type { Domain } from '../model/types'; // فقط اینترفیس را ایمپورت می‌کنیم

const BASE_URL = '/domains';

export const domainsService = {
  getAll: (): Promise<ApiResponse<Domain[]>> => {
    return api.get<Domain[]>(BASE_URL);
  },

  create: (domainData: Omit<Domain, 'id'>): Promise<ApiResponse<Domain>> => {
    return api.post<Domain>(BASE_URL, domainData);
  },

  update: (id: string, domainData: Partial<Domain>): Promise<ApiResponse<Domain>> => {
    return api.put<Domain>(`${BASE_URL}/${id}`, domainData);
  },

  delete: (id: string): Promise<ApiResponse<boolean>> => {
    return api.delete<boolean>(`${BASE_URL}/${id}`);
  }
};