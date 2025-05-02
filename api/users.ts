import { apiRequest } from "./index"

export interface UserProfile {
  firstName: string
  middleName?: string
  surName: string
  phoneNumber: string
  country: string
  stateOfOrigin: string
  address: string
  imageurl?: string
}

export interface UpdateProfileResponse {
  status: string
  data: {
    user: UserProfile
  }
}

export interface UploadImageResponse {
  status: string
  data: {
    imageurl: string
  }
}

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UpdateProfileResponse> => {
  try {
    const response = await apiRequest("/api/v1/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
    return response
  } catch (error) {
    throw error
  }
}

export const uploadProfileImage = async (imageFile: File): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await apiRequest("/api/v1/users/upload-profile-image", {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type here, it will be set automatically with the correct boundary
      },
    })
    return response
  } catch (error) {
    throw error
  }
}

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiRequest("/api/v1/users/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    return response
  } catch (error) {
    throw error
  }
}

export const updateNotificationSettings = async (settings: {
  email: boolean
  sms: boolean
  app: boolean
}): Promise<{ status: string; data: { settings: any } }> => {
  try {
    const response = await apiRequest("/api/v1/users/notification-settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    })
    return response
  } catch (error) {
    throw error
  }
}
