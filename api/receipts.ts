import { apiRequest } from "./index"

export interface Receipt {
  _id: string
  userId: string
  amount: number
  reference: string
  status: string
  paymentMethod: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface ReceiptsResponse {
  status: string
  data: {
    receipts: Receipt[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export interface ReceiptResponse {
  status: string
  data: Receipt
}

export const getUserReceipts = async (page = 1, limit = 10): Promise<ReceiptsResponse> => {
  try {
    const response = await apiRequest(`/users/receipts?page=${page}&limit=${limit}`)
    return response
  } catch (error) {
    throw error
  }
}

export const getReceiptById = async (receiptId: string): Promise<ReceiptResponse> => {
  try {
    const response = await apiRequest(`/users/receipts/${receiptId}`)
    return response
  } catch (error) {
    throw error
  }
}

export const downloadReceipt = async (receiptId: string): Promise<Blob> => {
  try {
    const response = await apiRequest(`/users/receipts/${receiptId}/download`, {
      headers: {
        Accept: "application/pdf",
      },
    })
    return await response.blob()
  } catch (error) {
    throw error
  }
}
