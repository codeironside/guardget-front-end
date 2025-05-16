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

export const deviceApi = {
  getAll: async () => {
    const response = await apiClient.get("/device");
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

  searchDevice: async (query: string) => {
    // The query parameter should be passed as "qparams"
    // Check if query already has the qparams prefix
    const formattedQuery = query.startsWith("qparams=")
      ? query
      : `qparams=${query}`;
    const response = await apiClient.get(`/device/search?${formattedQuery}`);
    return response.data;
  },

  transferOwnership: async (deviceId: string, newUserEmail: string) => {
    const response = await apiClient.put("/device/transferOwnership", {
      newuseremail: newUserEmail,
      deviceId,
    });
    return response.data;
  },

  transferDeviceOtp: async () => {
    const response = await apiClient.get("/device/transferOtp");
    return response.data;
  },
  resendDevicetransferOtp: async (registerationToken: string) => {
    const response = await apiClient.post("/device/resendDevicetransferOtp", {
      registerationToken,
    });

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
