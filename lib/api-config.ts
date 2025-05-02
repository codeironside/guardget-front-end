// API configuration with environment variables
export const API_BASE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3124"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3124";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
  VERIFY_OTP: `${API_BASE_URL}/api/v1/auth/verify-otp`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/v1/auth/reset-password`,

  // User
  GET_USER_PROFILE: `${API_BASE_URL}/api/v1/user/profile`,
  UPDATE_USER_PROFILE: `${API_BASE_URL}/api/v1/user/update-profile`,
  UPLOAD_PROFILE_IMAGE: `${API_BASE_URL}/api/v1/user/upload-profile-image`,

  // Devices
  GET_USER_DEVICES: `${API_BASE_URL}/api/v1/devices/user-devices`,
  REGISTER_DEVICE: `${API_BASE_URL}/api/v1/devices/register`,
  CHECK_DEVICE_STATUS: `${API_BASE_URL}/api/v1/devices/check-status`,

  // Subscription
  GET_SUBSCRIPTION_PLANS: `${API_BASE_URL}/api/v1/subscription/getallSubscription`,
  GET_USER_SUBSCRIPTION: `${API_BASE_URL}/api/v1/subscription/user-subscription`,
  INITIALIZE_PAYMENT: `${API_BASE_URL}/api/v1/payment/initialize`,
  VERIFY_PAYMENT: `${API_BASE_URL}/api/v1/payment/callback`,

  // Receipts
  GET_USER_RECEIPTS: `${API_BASE_URL}/api/v1/receipts/user-receipts`,
  GET_RECEIPT_DETAILS: `${API_BASE_URL}/api/v1/receipts/details`,

  // Admin
  GET_ALL_USERS: `${API_BASE_URL}/api/v1/admin/users`,
  GET_ALL_DEVICES: `${API_BASE_URL}/api/v1/admin/devices`,
  GET_ALL_RECEIPTS: `${API_BASE_URL}/api/v1/admin/receipts`,
  GET_ALL_SUBSCRIPTIONS: `${API_BASE_URL}/api/v1/admin/subscriptions`,
};
