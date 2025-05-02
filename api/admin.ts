import { apiConfig } from "@/lib/api-config"
import { mockService } from "@/lib/mock-service"

// Get all users
export const getAllUsers = async () => {
  try {
    if (apiConfig.useMock) {
      return mockService.getAllUsers()
    }

    const response = await fetch(`${apiConfig.baseUrl}/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch users")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching users:", error)
    throw new Error(error.message || "Failed to fetch users")
  }
}

// Get user by ID
export const getUserById = async (userId: string) => {
  try {
    if (apiConfig.useMock) {
      return mockService.getUserById(userId)
    }

    const response = await fetch(`${apiConfig.baseUrl}/admin/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch user")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching user:", error)
    throw new Error(error.message || "Failed to fetch user")
  }
}

// Get all receipts for a specific user
export const getUserReceipts = async (userId: string) => {
  try {
    if (apiConfig.useMock) {
      return mockService.getUserReceipts(userId)
    }

    const response = await fetch(`${apiConfig.baseUrl}/admin/users/${userId}/receipts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch user receipts")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching user receipts:", error)
    throw new Error(error.message || "Failed to fetch user receipts")
  }
}

// Get all devices for a specific user
export const getUserDevices = async (userId: string) => {
  try {
    if (apiConfig.useMock) {
      return mockService.getUserDevices(userId)
    }

    const response = await fetch(`${apiConfig.baseUrl}/admin/users/${userId}/devices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch user devices")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching user devices:", error)
    throw new Error(error.message || "Failed to fetch user devices")
  }
}

// Get a single device for a specific user
export const getUserDevice = async (userId: string, deviceId: string) => {
  try {
    if (apiConfig.useMock) {
      return mockService.getUserDevice(userId, deviceId)
    }

    const response = await fetch(`${apiConfig.baseUrl}/admin/users/${userId}/devices/${deviceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch user device")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching user device:", error)
    throw new Error(error.message || "Failed to fetch user device")
  }
}

// Search for users by name (first, last), email, or username
export const searchUsers = async (query: string) => {
  try {
    if (apiConfig.useMock) {
      return mockService.searchUsers(query)
    }

    const response = await fetch(`${apiConfig.baseUrl}/admin/users/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to search users")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error searching users:", error)
    throw new Error(error.message || "Failed to search users")
  }
}

// Get detailed information for a user by their ID, including receipts and devices
export const getUserDetails = async (userId: string) => {
  try {
    if (apiConfig.useMock) {
      return mockService.getUserDetails(userId)
    }

    const response = await fetch(`${apiConfig.baseUrl}/admin/users/${userId}/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch user details")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching user details:", error)
    throw new Error(error.message || "Failed to fetch user details")
  }
}

// Search for receipts within a user's information
export const searchUserReceipts = async (userId: string, query: string) => {
  try {
    if (apiConfig.useMock) {
      return mockService.searchUserReceipts(userId, query)
    }

    const response = await fetch(
      `${apiConfig.baseUrl}/admin/users/${userId}/receipts/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to search user receipts")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error searching user receipts:", error)
    throw new Error(error.message || "Failed to search user receipts")
  }
}

// Search for devices within a user's information
export const searchUserDevices = async (userId: string, query: string) => {
  try {
    if (apiConfig.useMock) {
      return mockService.searchUserDevices(userId, query)
    }

    const response = await fetch(
      `${apiConfig.baseUrl}/admin/users/${userId}/devices/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to search user devices")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error searching user devices:", error)
    throw new Error(error.message || "Failed to search user devices")
  }
}

// Get all receipts
export const getAllReceipts = async () => {
  try {
    if (apiConfig.useMock) {
      return mockService.getAllReceipts()
    }

    const response = await fetch(`${apiConfig.baseUrl}/admin/receipts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch receipts")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching receipts:", error)
    throw new Error(error.message || "Failed to fetch receipts")
  }
}

// Get all subscriptions
export const getAllSubscriptions = async () => {
  try {
    if (apiConfig.useMock) {
      return mockService.getAllSubscriptions()
    }

    const response = await fetch(`${apiConfig.baseUrl}/admin/subscriptions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch subscriptions")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error)
    throw new Error(error.message || "Failed to fetch subscriptions")
  }
}
