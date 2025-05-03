import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  keyholderPhone1: string;
  keyholderPhone2: string;
  firstName: string;
  middleName: string;
  surName: string;
  role: string;
  country: string;
  stateOfOrigin: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
}

export interface OtpVerificationData {
  otp: string;
  registrationToken: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/users/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const formattedData = {
      ...data,
      firstName: data.firstName.toUpperCase(),
      middleName: data.middleName.toUpperCase(),
      surName: data.surName.toUpperCase(),
      country: data.country.toUpperCase(),
      stateOfOrigin: data.stateOfOrigin.toUpperCase(),
    };
    const response = await apiClient.post('/users/create', formattedData);
    return response.data;
  },

  verifyOtp: async (data: OtpVerificationData) => {
    const response = await apiClient.post('/users/validateOtp', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/forgetpassword', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    return response.data;
  },

  getUserProfile: async () => {
    const response = await apiClient.get('/users/getme');
    return response.data;
  },

  updateProfile: async (data: Partial<RegisterData>) => {
    const response = await apiClient.put('/users/update-user', data);
    return response.data;
  },

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.put('/users/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await apiClient.put('/users/change-password', data);
    return response.data;
  },
};