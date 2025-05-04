import { apiClient } from './client';

export interface Subscription {
  _id: string;
  name: string;
  NoOfDevices: number;
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitialization {
  subId: string;
  duration: number;
  durationUnit: 'months' | 'years';
}

export const subscriptionApi = {
  getAll: async () => {
    const response = await apiClient.get('/subscription/getallSubscription');
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await apiClient.get(`/subscription/getOneSubscription/${id}`);
    return response.data;
  },

  initializePayment: async (data: PaymentInitialization) => {
    const response = await apiClient.post('/payment/initialize', data);
    return response.data;
  },

  verifyPayment: async (reference: string) => {
    const response = await apiClient.post(`/payment/callback?reference=${reference}`);
    return response.data;
  },

  getUserReceipts: async () => {
    const response = await apiClient.get('/payment/getallreceiptforuser');
    return response.data;
  },

  getReceipt: async (id: string) => {
    const response = await apiClient.get(`/payment/getoneforuser/${id}`);
    return response.data;
  }
};