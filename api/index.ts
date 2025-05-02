const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3124/api/v1"

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean
}

// Generic API request function with authentication
export const apiRequest = async (endpoint: string, options: ApiRequestOptions = {}) => {
  const { skipAuth = false, ...fetchOptions } = options
  const token = skipAuth ? null : getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  }

  const config = {
    ...fetchOptions,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      // Handle different error status codes appropriately
      if (response.status === 401) {
        // Handle unauthorized (e.g., token expired)
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("user")
          window.location.href = "/auth/login"
        }
      }

      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }

    // Check if response is expected to be a blob
    if (fetchOptions.headers && (fetchOptions.headers as any).Accept === "application/pdf") {
      return response
    }

    return await response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}
