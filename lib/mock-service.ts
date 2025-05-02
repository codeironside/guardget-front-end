// This file contains mock data and functions for development and testing

// Mock user data
const mockUsers = [
  {
    id: "1",
    userDetails: {
      firstName: "John",
      middleName: "",
      surName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1234567890",
      country: "Nigeria",
      stateOfOrigin: "Lagos",
      address: "123 Main St",
      imageurl: "",
      subActive: true,
    },
    role: "user",
  },
  {
    id: "2",
    userDetails: {
      firstName: "Jane",
      middleName: "Marie",
      surName: "Smith",
      email: "jane.smith@example.com",
      phoneNumber: "+1987654321",
      country: "Nigeria",
      stateOfOrigin: "Abuja",
      address: "456 Oak Ave",
      imageurl: "",
      subActive: false,
    },
    role: "user",
  },
  {
    id: "3",
    userDetails: {
      firstName: "Admin",
      middleName: "",
      surName: "User",
      email: "admin@guardget.com",
      phoneNumber: "+2347012345678",
      country: "Nigeria",
      stateOfOrigin: "Lagos",
      address: "789 Admin St",
      imageurl: "",
      subActive: true,
    },
    role: "admin",
  },
]

// Mock devices data
const mockDevices = [
  {
    id: "d1",
    userId: "1",
    name: "iPhone 13 Pro",
    IMIE1: "123456789012345",
    IMEI2: "",
    SN: "C02G30LFMD6M",
    Type: "Phone",
    status: "active",
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "d2",
    userId: "1",
    name: "MacBook Pro",
    SN: "C02G30LFMD6N",
    Type: "Laptop",
    status: "active",
    createdAt: "2023-04-10T14:45:00Z",
  },
  {
    id: "d3",
    userId: "2",
    name: "Samsung Galaxy S22",
    IMIE1: "987654321098765",
    IMEI2: "987654321098766",
    SN: "R31DA2JKXPH",
    Type: "Phone",
    status: "missing",
    createdAt: "2023-03-05T09:15:00Z",
  },
]

// Mock receipts data
const mockReceipts = [
  {
    id: "r1",
    userId: "1",
    receiptNumber: "REC-2023-001",
    date: "2023-05-15T10:30:00Z",
    items: [
      {
        description: "Premium Subscription - 1 Year",
        quantity: 1,
        unitPrice: 99.99,
        amount: 99.99,
      },
    ],
    subtotal: 99.99,
    tax: 10.0,
    total: 109.99,
    paymentMethod: "Credit Card",
    status: "paid",
  },
  {
    id: "r2",
    userId: "2",
    receiptNumber: "REC-2023-002",
    date: "2023-04-10T14:45:00Z",
    items: [
      {
        description: "Basic Subscription - 6 Months",
        quantity: 1,
        unitPrice: 59.99,
        amount: 59.99,
      },
    ],
    subtotal: 59.99,
    tax: 6.0,
    total: 65.99,
    paymentMethod: "PayPal",
    status: "paid",
  },
]

// Mock subscriptions data
const mockSubscriptions = [
  {
    id: "s1",
    userId: "1",
    plan: "Premium",
    startDate: "2023-05-15T10:30:00Z",
    endDate: "2024-05-15T10:30:00Z",
    status: "active",
    autoRenew: true,
    price: 99.99,
  },
  {
    id: "s2",
    userId: "2",
    plan: "Basic",
    startDate: "2023-04-10T14:45:00Z",
    endDate: "2023-10-10T14:45:00Z",
    status: "expired",
    autoRenew: false,
    price: 59.99,
  },
]

// Mock service functions
export const mockService = {
  // Auth functions
  login: async (email: string, password: string) => {
    const user = mockUsers.find((u) => u.userDetails.email === email)
    if (!user) {
      throw new Error("Invalid email or password")
    }
    return {
      token: "mock-jwt-token",
      user,
    }
  },

  register: async (userData: any) => {
    const newUser = {
      id: `${mockUsers.length + 1}`,
      userDetails: {
        ...userData,
        subActive: false,
        imageurl: "",
      },
      role: "user",
    }
    mockUsers.push(newUser)
    return {
      token: "mock-jwt-token",
      user: newUser,
    }
  },

  forgotPassword: async (email: string) => {
    const user = mockUsers.find((u) => u.userDetails.email === email)
    if (!user) {
      throw new Error("User not found")
    }
    return {
      message: "Password reset link sent to your email",
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    return {
      message: "Password reset successful",
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    return {
      message: "OTP verified successfully",
    }
  },

  // User functions
  getMe: async () => {
    return mockUsers[0]
  },

  updateProfile: async (userData: any) => {
    mockUsers[0].userDetails = {
      ...mockUsers[0].userDetails,
      ...userData,
    }
    return {
      message: "Profile updated successfully",
      user: mockUsers[0],
    }
  },

  uploadProfileImage: async (file: File) => {
    return {
      message: "Profile image uploaded successfully",
      data: {
        imageurl: "https://example.com/profile-image.jpg",
      },
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    return {
      message: "Password updated successfully",
    }
  },

  updateNotificationSettings: async (settings: any) => {
    return {
      message: "Notification settings updated successfully",
    }
  },

  // Device functions
  getUserDevices: async () => {
    return mockDevices.filter((d) => d.userId === "1")
  },

  getDeviceById: async (deviceId: string) => {
    const device = mockDevices.find((d) => d.id === deviceId)
    if (!device) {
      throw new Error("Device not found")
    }
    return device
  },

  registerDevice: async (deviceData: any) => {
    const newDevice = {
      id: `d${mockDevices.length + 1}`,
      userId: "1",
      ...deviceData,
      createdAt: new Date().toISOString(),
    }
    mockDevices.push(newDevice)
    return {
      message: "Device registered successfully",
      device: newDevice,
    }
  },

  updateDeviceStatus: async (deviceId: string, status: string) => {
    const device = mockDevices.find((d) => d.id === deviceId)
    if (!device) {
      throw new Error("Device not found")
    }
    device.status = status
    return {
      message: "Device status updated successfully",
      device,
    }
  },

  transferDevice: async (deviceId: string, email: string) => {
    const device = mockDevices.find((d) => d.id === deviceId)
    if (!device) {
      throw new Error("Device not found")
    }
    const targetUser = mockUsers.find((u) => u.userDetails.email === email)
    if (!targetUser) {
      throw new Error("Target user not found")
    }
    device.userId = targetUser.id
    return {
      message: "Device transferred successfully",
    }
  },

  // Receipt functions
  getUserReceipts: async () => {
    return mockReceipts.filter((r) => r.userId === "1")
  },

  getReceiptById: async (receiptId: string) => {
    const receipt = mockReceipts.find((r) => r.id === receiptId)
    if (!receipt) {
      throw new Error("Receipt not found")
    }
    return receipt
  },

  // Subscription functions
  getUserSubscription: async () => {
    return mockSubscriptions.find((s) => s.userId === "1")
  },

  createSubscription: async (planData: any) => {
    const newSubscription = {
      id: `s${mockSubscriptions.length + 1}`,
      userId: "1",
      ...planData,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    }
    mockSubscriptions.push(newSubscription)
    mockUsers[0].userDetails.subActive = true
    return {
      message: "Subscription created successfully",
      subscription: newSubscription,
    }
  },

  cancelSubscription: async () => {
    const subscription = mockSubscriptions.find((s) => s.userId === "1")
    if (subscription) {
      subscription.autoRenew = false
    }
    return {
      message: "Subscription auto-renewal cancelled",
    }
  },

  // Admin functions
  getAllUsers: async () => {
    return mockUsers
  },

  getUserById: async (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  },

  getAllReceipts: async () => {
    return mockReceipts
  },

  getAllSubscriptions: async () => {
    return mockSubscriptions
  },

  getUserReceipts: async (userId: string) => {
    return mockReceipts.filter((r) => r.userId === userId)
  },

  getUserDevices: async (userId: string) => {
    return mockDevices.filter((d) => d.userId === userId)
  },

  getUserDevice: async (userId: string, deviceId: string) => {
    const device = mockDevices.find((d) => d.userId === userId && d.id === deviceId)
    if (!device) {
      throw new Error("Device not found")
    }
    return device
  },

  searchUsers: async (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return mockUsers.filter(
      (u) =>
        u.userDetails.firstName.toLowerCase().includes(lowercaseQuery) ||
        u.userDetails.surName.toLowerCase().includes(lowercaseQuery) ||
        u.userDetails.email.toLowerCase().includes(lowercaseQuery),
    )
  },

  getUserDetails: async (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      throw new Error("User not found")
    }
    const devices = mockDevices.filter((d) => d.userId === userId)
    const receipts = mockReceipts.filter((r) => r.userId === userId)
    const subscription = mockSubscriptions.find((s) => s.userId === userId)

    return {
      user,
      devices,
      receipts,
      subscription,
    }
  },

  searchUserReceipts: async (userId: string, query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return mockReceipts.filter(
      (r) =>
        r.userId === userId &&
        (r.receiptNumber.toLowerCase().includes(lowercaseQuery) ||
          r.paymentMethod.toLowerCase().includes(lowercaseQuery)),
    )
  },

  searchUserDevices: async (userId: string, query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return mockDevices.filter(
      (d) =>
        d.userId === userId &&
        (d.name.toLowerCase().includes(lowercaseQuery) ||
          d.Type.toLowerCase().includes(lowercaseQuery) ||
          (d.SN && d.SN.toLowerCase().includes(lowercaseQuery))),
    )
  },
}
