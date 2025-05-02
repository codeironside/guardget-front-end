import { apiRequest } from "./index"

export interface SubscriptionPlan {
  _id: string
  name: string
  description: string
  price: number
  duration: number
  features: string[]
  isPopular?: boolean
}

export interface UserSubscription {
  _id: string
  userId: string
  planId: string
  planName: string
  startDate: string
  endDate: string
  status: string
  receiptId: string
  createdAt: string
  updatedAt: string
}

export interface PlansResponse {
  status: string
  data: SubscriptionPlan[]
}

export interface SubscriptionResponse {
  status: string
  data: UserSubscription
}

export interface InitiatePaymentResponse {
  status: string
  data: {
    authorizationUrl: string
    reference: string
  }
}

export interface VerifyPaymentResponse {
  status: string
  data: {
    receipt: {
      _id: string
      amount: number
      reference: string
      status: string
    }
    subscription?: UserSubscription
  }
}

export const getSubscriptionPlans = async (): Promise<PlansResponse> => {
  try {
    const response = await apiRequest("/api/v1/subscriptions/plans")
    return response
  } catch (error) {
    throw error
  }
}

export const getUserSubscription = async (): Promise<SubscriptionResponse> => {
  try {
    const response = await apiRequest("/api/v1/subscriptions/user")
    return response
  } catch (error) {
    throw error
  }
}

export const initiatePayment = async (planId: string): Promise<InitiatePaymentResponse> => {
  try {
    const response = await apiRequest("/api/v1/subscriptions/initiate-payment", {
      method: "POST",
      body: JSON.stringify({ planId }),
    })
    return response
  } catch (error) {
    throw error
  }
}

export const verifyPayment = async (reference: string): Promise<VerifyPaymentResponse> => {
  try {
    const response = await apiRequest(`/api/v1/subscriptions/verify-payment?reference=${reference}`)
    return response
  } catch (error) {
    throw error
  }
}
