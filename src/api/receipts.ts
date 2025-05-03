import { apiClient } from './client';

export interface Receipt {
  _id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  reference: string;
  createdAt: string;
}

export const receiptApi = {
  getAll: async () => {
    const response = await apiClient.get('/receipts');
    return response.data;
  },

  getOne: async (receiptId: string) => {
    const response = await apiClient.get(`/receipts/${receiptId}`);
    return response.data;
  },

  download: async (receiptId: string) => {
    const response = await apiClient.get(`/receipts/${receiptId}/download`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt-${receiptId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};