import { apiRequest } from "./index"

export interface UserDetails {
  _id: string
  username: string
  firstName: string
  middleName: string
  surName: string
  role: string
  country: string
  stateOfOrigin: string
  phoneNumber: string
  address: string
  email: string
  keyholder: string
  emailVerified: boolean
  subActive: boolean
  createdAt: string
  updatedAt: string
  imageurl?: string
}

export interface UserData {
  userDetails: UserDetails
  devices: any[]
  financialSummary: {
    totalSpent: number
    receiptCount: number
    lastPayment: string | null
    averagePayment: number
  }
}

export interface LoginResponse {
  status: string
  data: {
    accessToken: string
    role: string
  }
}

export interface RegisterResponse {
  status: string
  data: {
    user: {
      _id: string
      email: string
    }
  }
}

export interface GetMeResponse {
  status: string
  data: UserData
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify({ email:email.email, password:email.password}),
      skipAuth: true,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const register = async (userData: {
  firstName: string
  middleName?: string
  surName: string
  email: string
  password: string
  phoneNumber: string
}): Promise<RegisterResponse> => {
  try {
    const response = await apiRequest("/users/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      skipAuth: true,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const verifyOtp = async (email: string, otp: string): Promise<{ status: string; data: any }> => {
  try {
    const response = await apiRequest("/users/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
      skipAuth: true,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const resendOtp = async (email: string): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiRequest("/users/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
      skipAuth: true,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const forgotPassword = async (email: string): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiRequest("/users/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      skipAuth: true,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const resetPassword = async (token: string, password: string): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiRequest("/users/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
      skipAuth: true,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const getMe = async (): Promise<GetMeResponse> => {
  try {
    const response = await apiRequest("/users/getme")
    return response
  } catch (error) {
    throw error
  }
}

export const logout = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiRequest("/users/auth/logout", {
      method: "POST",
    })
    return response
  } catch (error) {
    throw error
  }
}
