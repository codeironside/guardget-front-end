import { apiClient } from './client';

export interface Device {
  id: string;
  name: string;
  model: string;
  type: string;
  serialNumber: string;
  imei?: string;
  status: 'active' | 'reported' | 'missing' | 'stolen';
}

export const deviceApi = {
  getAll: async () => {
    const response = await apiClient.get('/device');
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await apiClient.get(`/device/${id}`);
    return response.data;
  },

  create: async (deviceData: Partial<Device>) => {
    console.log(`device data ${JSON.stringify(deviceData)}`)
    const response = await apiClient.post('/device', deviceData);
    return response.data;
  },

  updateStatus: async (id: string, status: Device['status']) => {
    const response = await apiClient.put(`/device/updatestatus/${id}`, { status });
    return response.data;
  },

  searchDevice: async (query: string) => {
    const response = await apiClient.get(`/device/search?query=${query}`);
    return response.data;
  },

  transferOwnership: async (deviceId: string, newUserEmail: string) => {
    const response = await apiClient.put('/device/transferOwnership', {
      newuseremail: newUserEmail,
      deviceId
    });
    return response.data;
  }
};