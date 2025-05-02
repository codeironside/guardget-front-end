import { apiRequest } from "./index"

export interface Device {
  _id: string
  name: string
  Type: string
  IMIE1?: string
  IMEI2?: string
  SN: string
  status: "active" | "stolen" | "missing" | "inactive"
  dateAdded?: string
  lastSeen?: string
  batteryLevel?: number
  location?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface DevicesResponse {
  status: string
  data: Device[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface DeviceResponse {
  status: string
  data: Device
}

export interface DeviceStatusResponse {
  status: string
  data: {
    device: Device | null
    owner: {
      _id: string
      firstName: string
      surName: string
      phoneNumber: string
      imageurl?: string
    } | null
  }
}

export interface TransferDeviceRequest {
  imei: string
  sn: string
  newUserEmail: string
}

export const getUserDevices = async (page = 1, limit = 10): Promise<DevicesResponse> => {
  try {
    const response = await apiRequest(`/devices?page=${page}&limit=${limit}`)
    return response
  } catch (error) {
    throw error
  }
}

export const getDeviceById = async (deviceId: string): Promise<DeviceResponse> => {
  try {
    const response = await apiRequest(`/devices/${deviceId}`)
    return response
  } catch (error) {
    throw error
  }
}

export const registerDevice = async (deviceData: Partial<Device>): Promise<DeviceResponse> => {
  try {
    const response = await apiRequest("/device", {
      method: "POST",
      body: JSON.stringify(deviceData),
    })
    return response
  } catch (error) {
    throw error
  }
}

export const updateDeviceStatus = async (
  deviceId: string,
  status: "active" | "stolen" | "missing",
  details?: any,
): Promise<DeviceResponse> => {
  try {
    const response = await apiRequest(`/users/devices/${deviceId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, ...details }),
    })
    return response
  } catch (error) {
    throw error
  }
}

export const checkDeviceStatus = async (identifier: string): Promise<DeviceStatusResponse> => {
  try {
    const response = await apiRequest(`/users/devices/check?identifier=${identifier}`, {
      skipAuth: true,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const transferDevice = async (transferData: TransferDeviceRequest): Promise<DeviceResponse> => {
  try {
    const response = await apiRequest("/users/devices/transfer", {
      method: "POST",
      body: JSON.stringify(transferData),
    })
    return response
  } catch (error) {
    throw error
  }
}
