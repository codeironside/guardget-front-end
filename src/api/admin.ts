import { apiClient } from './client';

export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
    subscriptionTiers: Array<{
      _id: string;
      count: number;
    }>;
    recent: Array<{
      _id: string;
      username: string;
      email: string;
      createdAt: string;
      subscriptionStatus: string;
    }>;
  };
  devices: {
    total: number;
    byStatus: Array<{
      _id: string;
      count: number;
    }>;
    byType: Array<{
      _id: string;
      count: number;
    }>;
    recent: Array<{
      _id: string;
      name: string;
      status: string;
      createdAt: string;
      type: string;
    }>;
  };
  receipts: {
    total: number;
    revenue: number;
    recent: Array<{
      _id: string;
      amount: number;
      status: string;
      createdAt: string;
      user: {
        _id: string;
        username: string;
      };
    }>;
  };
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  subscriptionStatus?: string;
}

export interface DeviceListParams {
  page?: number;
  limit?: number;
  userId?: string;
  status?: string;
  type?: string;
}

export interface ReceiptListParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const adminApi = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/getOneself');
    return response.data;
  },

  getAllUsers: async (params?: UserListParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.subscriptionStatus) queryParams.append('subscriptionStatus', params.subscriptionStatus);

    const response = await apiClient.get(`/admin/getalluser?${queryParams.toString()}`);
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await apiClient.get(`/admin/getoneuser/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await apiClient.put(`/admin/updateuser/${id}`, data);
    return response.data;
  },

  createAdmin: async (data: any) => {
    const response = await apiClient.post('/admin/createadmin', data);
    return response.data;
  },

  getAllDevices: async (params?: DeviceListParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);

    const response = await apiClient.get(`/admin/getdeVices?${queryParams.toString()}`);
    return response.data;
  },

  getUserDevices: async (userId: string) => {
    const response = await apiClient.get(`/admin/getallforauser/${userId}`);
    return response.data;
  },

  getAllReceipts: async (params?: ReceiptListParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.status) queryParams.append('status', params.status);

    const response = await apiClient.get(`/admin/getAllreceipt?${queryParams.toString()}`);
    return response.data;
  },

  getUserReceipts: async (userId: string) => {
    const response = await apiClient.get(`/admin/getUserReceipts/${userId}`);
    return response.data;
  },

  getReceipt: async (id: string) => {
    const response = await apiClient.get(`/admin/getOneReceipt/${id}`);
    return response.data;
  },
  deactivateUser: async (id: string,status:boolean) => {
    const response = await apiClient.patch(`/admin/${id}/deactivate`,{status});
    return response.data;
  }
};