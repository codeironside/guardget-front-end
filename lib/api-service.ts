import { API_ENDPOINTS } from "./api-config";

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Generic API request function with authentication
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    // Handle different error status codes appropriately
    if (response.status === 401) {
      // Handle unauthorized (e.g., token expired)
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
};

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: any) => {
    return apiRequest(API_ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  verifyOtp: async (email: string, otp: string) => {
    return apiRequest(API_ENDPOINTS.VERIFY_OTP, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

// User services
export const userService = {
  getProfile: async () => {
    return apiRequest(API_ENDPOINTS.GET_USER_PROFILE);
  },

  updateProfile: async (profileData: any) => {
    return apiRequest(API_ENDPOINTS.UPDATE_USER_PROFILE, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  uploadProfileImage: async (formData: FormData) => {
    const token = getAuthToken();

    return fetch(API_ENDPOINTS.UPLOAD_PROFILE_IMAGE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      return response.json();
    });
  },
};

// Device services
export const deviceService = {
  getUserDevices: async () => {
    return apiRequest(API_ENDPOINTS.GET_USER_DEVICES);
  },

  registerDevice: async (deviceData: any) => {
    return apiRequest(API_ENDPOINTS.REGISTER_DEVICE, {
      method: "POST",
      body: JSON.stringify(deviceData),
    });
  },

  checkDeviceStatus: async (imei: string) => {
    return apiRequest(`${API_ENDPOINTS.CHECK_DEVICE_STATUS}?imei=${imei}`);
  },
};

// Subscription services
export const subscriptionService = {
  getPlans: async () => {
    return apiRequest(API_ENDPOINTS.GET_SUBSCRIPTION_PLANS);
  },

  getUserSubscription: async () => {
    return apiRequest(API_ENDPOINTS.GET_USER_SUBSCRIPTION);
  },

  initializePayment: async (subscriptionData: any) => {
    return apiRequest(API_ENDPOINTS.INITIALIZE_PAYMENT, {
      method: "POST",
      body: JSON.stringify(subscriptionData),
    });
  },

  verifyPayment: async (reference: string) => {
    return apiRequest(`${API_ENDPOINTS.VERIFY_PAYMENT}?reference=${reference}`);
  },
};

// Receipt services
export const receiptService = {
  getUserReceipts: async () => {
    return apiRequest(API_ENDPOINTS.GET_USER_RECEIPTS);
  },

  getReceiptDetails: async (receiptId: string) => {
    return apiRequest(`${API_ENDPOINTS.GET_RECEIPT_DETAILS}/${receiptId}`);
  },
};

// Admin services
export const adminService = {
  getAllUsers: async () => {
    return apiRequest(API_ENDPOINTS.GET_ALL_USERS);
  },

  getAllDevices: async () => {
    return apiRequest(API_ENDPOINTS.GET_ALL_DEVICES);
  },

  getAllReceipts: async () => {
    return apiRequest(API_ENDPOINTS.GET_ALL_RECEIPTS);
  },

  getAllSubscriptions: async () => {
    return apiRequest(API_ENDPOINTS.GET_ALL_SUBSCRIPTIONS);
  },
};
