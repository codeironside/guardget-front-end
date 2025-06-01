import { apiClient } from "./client";

export interface Device {
  id: string;
  name: string;
  model: string;
  type: string;
  serialNumber: string;
  imei?: string;
  status: string;
}
export interface ApiResponse {
  status: "success" | "error";
  message?: string;
  data?: any;
  registrationToken?: string;
}
export const deviceApi = {
  getAll: async () => {
    const response = await apiClient.get("/device");
    return response.data;
  },
  AdminGetAll: async () => {
    const response = await apiClient.get("/admin/getdeVices");
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await apiClient.get(`/device/${id}`);
    return response.data;
  },

  create: async (deviceData: Partial<Device>) => {
    console.log(`device data ${JSON.stringify(deviceData)}`);
    const response = await apiClient.post("/device", deviceData);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: Device["status"],
    location: string,
    description: string
  ) => {
    console.log(
      `device id ${JSON.stringify(
        id
      )} status ${status} location ${location} description ${description}`
    );
    const response = await apiClient.put(
      `/device/updatestatus/${id.deviceId}`,
      {
        status: id.reportType,
        location: id.location,
        description: id.description,
      }
    );
    return response.data;
  },
  AdminUpdateStatus: async (
    id: string,
    status: Device["status"],
    location: string,
    description: string
  ) => {
    console.log(
      `device id ${JSON.stringify(
        id
      )} status ${status} location ${location} description ${description}`
    );
    const response = await apiClient.put(
      `/admin/report-device/${id.deviceId}`,
      {
        status: id.reportType,
        location: id.location,
        description: id.description,
      }
    );
    return response.data;
  },

  searchDevice: async (query: string) => {
    // The query parameter should be passed as "qparams"
    // Check if query already has the qparams prefix
    const formattedQuery = query.startsWith("qparams=")
      ? query
      : `qparams=${query}`;
    const response = await apiClient.get(`/device/search?${formattedQuery}`);
    return response.data;
  },

  transferOwnership: async (
    deviceId: string,
    recipientEmail: string,
    transferReason: string
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.put("/device/transferOwnership", {
        deviceId,
        recipientEmail,
        reason: transferReason, // Add the reason for transfer
      });
      return response.data;
    } catch (error: any) {
      console.error("Error transferring device:", error);

      // Check for JWT/session expiration errors
      if (
        error.response?.status === 401 ||
        error.message?.includes("jwt expired") ||
        error.message?.includes("session expired") ||
        error.response?.data?.message?.includes("jwt expired") ||
        error.response?.data?.message?.includes("session expired")
      ) {
        // Clear token from localStorage
        localStorage.removeItem("otprefreshtoken");
        return {
          status: "error",
          message: "Your session has expired. Please restart the process.",
        };
      }

      return { status: "error", message: error.message };
    }
  },

  resendDevicetransferOtp: async (token: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post("/device/transfer/resend-otp", {
        token,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error resending OTP:", error);

      // Check for JWT/session expiration errors
      if (
        error.response?.status === 401 ||
        error.message?.includes("jwt expired") ||
        error.message?.includes("session expired") ||
        error.response?.data?.message?.includes("jwt expired") ||
        error.response?.data?.message?.includes("session expired")
      ) {
        // Clear token from localStorage
        localStorage.removeItem("otprefreshtoken");
        return {
          status: "error",
          message: "Your session has expired. Please restart the process.",
        };
      }

      return { status: "error", message: error.message };
    }
  },
  transferDeviceOtp: async () => {
    const response = await apiClient.get("/device/transferOtp");
    return response.data;
  },

  verifyDeviceTransferOtp: async (otp: string, registrationToken: string) => {
    const response = await apiClient.post("/device/verifyDeviceTransferOtp", {
      otp,
      registrationToken,
    });
    return response.data;
  },
};
