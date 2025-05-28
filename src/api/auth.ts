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
// interface UserDetails {
//   _id: string;
//   username: string;
//   firstName: string;
//   middleName: string;
//   surName: string;
//   role: string;
//   country: string;
//   stateOfOrigin: string;
//   phoneNumber: string;
//   keyholderPhone1: string;
//   keyholderPhone2: string;
//   email: string;
//   emailVerified: boolean;
//   subActive: boolean;
//   createdAt: string; // or Date if you'll parse it
//   updatedAt: string; // or Date if you'll parse it
//   subActiveTill: string; // or Date if you'll parse it
//   subId: string;
//   subscription: string;
// }

// interface FinancialSummary {
//   totalSpent: number;
//   receiptCount: number;
//   lastPayment: string; // or Date if you'll parse it
//   averagePayment: number;
// }

// interface ApiResponseData {
//   userDetails: UserDetails;
//   devices: any[]; // Replace 'any' with a specific device interface if needed
//   financialSummary: FinancialSummary;
// }

// interface ApiResponse {
//   status: 'success' | 'error'; // or string if there are other possible values
//   data: ApiResponseData;
// }


export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post("/users/login", credentials);
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
    const response = await apiClient.post("/users/create", formattedData);
    return response.data;
  },
  getDashboard: async () => {
    const response = await apiClient.get("/users/getme");
    return response.data;
  },

  verifyOtp: async (data: OtpVerificationData) => {
    const response = await apiClient.post("/users/validateOtp", data);
    return response.data;
  },

  forgotPassword: async (phonenumber: string, password: string) => {
    console.log(`request body ${JSON.stringify(password)}`);
    const response = await apiClient.post("/users/forgetpassword", {
      phonenumber,
      password,
    });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  getUserProfile: async () => {
    const response = await apiClient.get("/users/getme");
    return response.data;
  },

  updateProfile: async (data: Partial<RegisterData>) => {
    const response = await apiClient.put("/users/update-user", data);
    return response.data;
  },

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.put(
      "/users/upload-profile-picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await apiClient.put("/users/change-password", data);
    return response.data;
  },
  resetPasswordWithToken: async (storedToken: string, otp: string) => {
    const response = await apiClient.post("/users/reset-password", {
      token: storedToken,
      otp:otp,
    });
    return response.data;
  }
};