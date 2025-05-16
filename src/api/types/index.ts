// src/types/index.ts
export interface Device {
  id: string;
  name: string;
  model?: string;
  Type?: string;
  type?: string;
  serialNumber?: string;
  SN?: string;
  imei?: string;
  IMEI?: string;
  IMEI2?: string;
  status: "active" | "reported" | "missing" | "stolen";
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface UserSuggestion {
  id: string;
  username: string;
  email: string;
  imageurl?: string;
  role: string;
  firstName?: string;
  surName?: string;
  middleName?: string;
}
