import { API_BASE_URL } from "./api-config";

interface LoginResponse {
  success: boolean;
  data?: {
    accessToken: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  message?: string;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error",
    };
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

export function getUserRole(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userRole");
  }
  return null;
}

export function setAuthData(token: string, role: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userRole", role);
  }
}

export function clearAuthData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
  }
}
