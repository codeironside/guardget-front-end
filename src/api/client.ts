import axios from 'axios';
import toast from 'react-hot-toast';

// const API_BASE_URL = "https://api.guardget.com/api/v1";
// const API_BASE_URL = "https://guardget-backend-api.onrender.com/api/v1";
const API_BASE_URL = "http://localhost:3124/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
      });
    }

    // Handle specific error status codes
    switch (error.response.status) {
      case 401:
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        toast.error('Your session has expired. Please log in again.');
        return Promise.reject({
          message: 'Your session has expired. Please log in again.',
        });

      case 403:
        toast.error('You do not have permission to perform this action.');
        return Promise.reject({
          message: 'You do not have permission to perform this action.',
        });

      case 429:
        toast.error('Too many requests. Please try again later.');
        return Promise.reject({
          message: 'Too many requests. Please try again later.',
        });

      case 500:
        toast.error('Server error. Please try again later.');
        return Promise.reject({
          message: 'Server error. Please try again later.',
        });

      default:
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
        toast.error(errorMessage);
        return Promise.reject({
          message: errorMessage,
        });
    }
  }
);

export default apiClient;