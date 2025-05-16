import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  // Your existing imports...
  Send,
  AlertCircle,
  Smartphone,
  Laptop,
  Check,
  X,
  Search,
  User,
  ChevronDown,
  RefreshCw, // Add this import
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import apiClient from "../../api/client";
import { deviceApi } from "../../api/devices";

// Types
interface Device {
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

interface UserSuggestion {
  id: string;
  username: string;
  email: string;
  imageurl?: string;
  role: string;
  firstName?: string;
  surName?: string;
  middleName?: string;
}

const userService = {
  searchUsers: async (query: string) => {
    try {
      const response = await apiClient.get(
        `http://localhost:3124/api/v1/users/search?query=${encodeURIComponent(
          query
        )}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      return { status: "error", data: [] };
    }
  },

  getRecentContacts: async () => {
    try {
      const response = await apiClient.get(
        "http://localhost:3124/api/v1/users/recent-contacts"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recent contacts:", error);
      return { status: "error", data: [] };
    }
  },
};

const TransferDevicePage = () => {
  // State
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load devices on mount
  useEffect(() => {
    loadDevices();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load user's devices
  const loadDevices = async () => {
    setLoading(true);
    try {
      const response = await deviceApi.getAll();
      if (response.status === "success" && response.data) {
        setDevices(response.data);
      } else {
        toast.error("Failed to load your devices");
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      toast.error("Failed to load your devices");
    } finally {
      setLoading(false);
    }
  };

  // Handle email input change with search
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipientEmail(value);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length >= 2 || value.includes("@")) {
      setIsLoadingSuggestions(true);
      setShowSuggestions(true);

      // Set a new timeout for search
      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(value);
      }, 300);
    } else if (value.length === 0) {
      // If input is cleared, load recent contacts
      handleEmailFocus();
    } else {
      setShowSuggestions(false);
      setUserSuggestions([]);
    }
  };

  // Search users
  const searchUsers = async (query: string) => {
    try {
      const response = await userService.searchUsers(query);
      if (response.status === "success") {
        // Filter out users with the specific role ID
        const filteredUsers = response.data.filter(
          (user) => user.role !== "680a6a229243635113957910"
        );
        setUserSuggestions(filteredUsers);
      } else {
        setUserSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setUserSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Load initial suggestions when email field is focused
  const handleEmailFocus = async () => {
    setShowSuggestions(true);
    setIsLoadingSuggestions(true);

    try {
      const response = await userService.getRecentContacts();
      if (response.status === "success") {
        // Filter out users with the specific role ID
        const filteredUsers = response.data.filter(
          (user) => user.role !== "680a6a229243635113957910"
        );
        setUserSuggestions(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Handle selecting a user suggestion
  const handleSelectSuggestion = (email: string) => {
    setRecipientEmail(email);
    setConfirmEmail(email); // Auto-fill the confirmation email
    setShowSuggestions(false);
  };

  // Handle selecting a device from the custom dropdown
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setDropdownOpen(false);
  };

  // Handle form submission
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!selectedDevice || !recipientEmail || !confirmEmail) {
  //     setError("Please fill in all required fields");
  //     return;
  //   }

  //   if (recipientEmail !== confirmEmail) {
  //     setError("Email addresses do not match");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const response = await deviceApi.transferOwnership(
  //       selectedDevice,
  //       recipientEmail
  //     );

  //     if (response.status === "success") {
  //       setSuccess(
  //         "Transfer request sent successfully. The recipient will receive instructions by email."
  //       );
  //       setSelectedDevice("");
  //       setRecipientEmail("");
  //       setConfirmEmail("");
  //       loadDevices();
  //     } else {
  //       setError(response.message || "Failed to transfer device");
  //     }
  //   } catch (error: any) {
  //     setError(error.message || "Failed to transfer device. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // Fix the transferDeviceOtp call - it's missing parameters
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDevice || !recipientEmail || !confirmEmail) {
      setError("Please fill in all required fields");
      return;
    }

    if (recipientEmail !== confirmEmail) {
      setError("Email addresses do not match");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setOtpError(null);

    try {
      // First request the OTP - Add the missing parameters here
      const otpResponse = await deviceApi.transferDeviceOtp(

      );

      if (otpResponse.status === "success") {
        setRegistrationToken(otpResponse.registrationToken);

        // Show the OTP input field
        setShowOtpInput(true);

        // Show a success message about OTP being sent
        setSuccess(
          "OTP has been sent to your key holders phone number. Please enter it to complete the transfer."
        );
      } else {
        setError(otpResponse.message || "Failed to initiate device transfer");
      }
    } catch (error: any) {
      setError(
        error.message || "Failed to initiate device transfer. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase for consistency
    setOtp(e.target.value.toUpperCase());

    // Clear any previous OTP errors when the user types
    if (otpError) {
      setOtpError(null);
    }
  };

  // Handle OTP verification
  // Fix OTP verification to correctly handle the transfer process
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 8) {
      setOtpError("Please enter a valid 8-character OTP");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);
    setError(null);
    setSuccess(null);

    try {
      // First verify the OTP
      const response = await deviceApi.verifyDeviceTransferOtp(
        otp,
        registrationToken
      );

      if (response.status === "success") {
        // If OTP verification is successful, proceed with the transfer
        try {
          const transferResponse = await deviceApi.transferOwnership(
            selectedDevice,
            recipientEmail
          );

          if (transferResponse.status === "success") {
            // Transfer completed successfully
            setSuccess(
              "Device transfer completed successfully. The recipient will be notified."
            );

            // Reset the form
            setShowOtpInput(false);
            setSelectedDevice("");
            setRecipientEmail("");
            setConfirmEmail("");
            setOtp("");
            setRegistrationToken("");

            // Reload devices to reflect the changes
            loadDevices();
          } else {
            // Transfer failed after OTP verification
            setError(
              transferResponse.message || "Failed to complete device transfer"
            );
          }
        } catch (transferError: any) {
          setError(
            transferError.message || "Failed to complete device transfer"
          );
        }
      } else {
        // OTP verification failed
        setOtpError(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      setOtpError(error.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle resending OTP
  const handleResendOtp = async () => {
    if (!registrationToken) {
      setError("Unable to resend OTP. Please try again from the beginning.");
      return;
    }

    setIsSubmitting(true);
    setOtpError(null);
    setError(null);
    setSuccess(null);

    try {
      const response = await deviceApi.resendDevicetransferOtp(
        registrationToken
      );

      if (response.status === "success") {
        setSuccess("OTP has been resent to your registered phone number.");
      } else {
        setOtpError(response.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      setOtpError(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Format user name for display
  const formatUserName = (user: UserSuggestion) => {
    if (user.firstName || user.surName) {
      return [user.firstName, user.middleName, user.surName]
        .filter(Boolean)
        .join(" ");
    }
    return user.username || user.email.split("@")[0];
  };

  // Get device icon based on type
  const getDeviceIcon = (device: Device) => {
    const type = device.Type?.toLowerCase() || device.type?.toLowerCase() || "";
    return type.includes("phone") || type.includes("smartphone") ? (
      <Smartphone className="h-5 w-5 text-primary" />
    ) : (
      <Laptop className="h-5 w-5 text-primary" />
    );
  };

  // Get device identifier (IMEI or Serial Number)
  const getDeviceIdentifier = (device: Device) => {
    const type = device.Type?.toLowerCase() || device.type?.toLowerCase() || "";
    if (type.includes("phone") || type.includes("smartphone")) {
      return `IMEI: ${device.IMEI || device.IMEI2 || device.imei || "N/A"}`;
    } else {
      return `S/N: ${device.SN || device.serialNumber || "N/A"}`;
    }
  };

  // Show loading spinner when loading devices
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Get the selected device details
  const getSelectedDevice = () => {
    return devices.find((d) => d.id === selectedDevice);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Send className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transfer Device Ownership
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {devices.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Devices Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You don't have any devices registered that can be transferred.
              </p>
              <button
                onClick={() => (window.location.href = "/devices/register")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Register a New Device
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="device"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Select Device
                </label>
                {/* Custom dropdown */}
                {/* <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150"
                  >
                    <div className="flex items-center">
                      {selectedDevice ? (
                        <>
                          {getSelectedDevice() &&
                            getDeviceIcon(getSelectedDevice()!)}
                          <span className="ml-2">
                            {getSelectedDevice()?.name || "Choose a device"}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          Choose a device
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        dropdownOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 text-base overflow-auto focus:outline-none max-h-60"
                      >
                        {devices.map((device) => (
                          <div
                            key={device.id}
                            onClick={() => handleSelectDevice(device.id)}
                            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ${
                              selectedDevice === device.id
                                ? "bg-gray-100 dark:bg-gray-600"
                                : ""
                            }`}
                          >
                            <div className="mr-3">{getDeviceIcon(device)}</div>
                            <div>
                              <div
                                className={`font-medium ${
                                  selectedDevice === device.id
                                    ? "text-primary"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {device.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {getDeviceIdentifier(device)}
                              </div>
                              <div className="text-xs mt-0.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full ${
                                    device.status === "active"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : device.status === "missing"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : device.status === "stolen"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                  }`}
                                >
                                  {device.status.charAt(0).toUpperCase() +
                                    device.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div> */}
                 
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() =>
                      !showOtpInput && setDropdownOpen(!dropdownOpen)
                    }
                    className={`flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ${
                      !showOtpInput
                        ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                        : "opacity-75"
                    } transition duration-150`}
                  >
                    <div className="flex items-center">
                      {selectedDevice ? (
                        <>
                          {getSelectedDevice() &&
                            getDeviceIcon(getSelectedDevice()!)}
                          <span className="ml-2">
                            {getSelectedDevice()?.name || "Choose a device"}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          Choose a device
                        </span>
                      )}
                    </div>
                    {!showOtpInput && (
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                          dropdownOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>

                  <AnimatePresence>
                    {dropdownOpen && !showOtpInput && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 text-base overflow-auto focus:outline-none max-h-60"
                      >
                        {/* Dropdown content remains the same */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {/* Selected device details */}
              {selectedDevice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md"
                >
                  {(() => {
                    const device = getSelectedDevice();
                    if (!device) return null;

                    return (
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">{getDeviceIcon(device)}</div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {device.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Model: {device.model || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getDeviceIdentifier(device)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                device.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : device.status === "missing"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : device.status === "stolen"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}
                            >
                              Status:{" "}
                              {device.status.charAt(0).toUpperCase() +
                                device.status.slice(1)}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
              {!showOtpInput ? (
                <div>
                  <label
                    htmlFor="recipientEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Recipient's Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="recipientEmail"
                      value={recipientEmail}
                      onChange={handleEmailChange}
                      onFocus={handleEmailFocus}
                      className="block w-full pl-10 pr-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter recipient's email address"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>

                    {/* Email suggestions dropdown */}
                    <AnimatePresence>
                      {showSuggestions && (
                        <motion.div
                          ref={suggestionsRef}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 text-base overflow-auto focus:outline-none max-h-60"
                        >
                          {/* Suggestions content remains the same */}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                // Display recipient email as read-only during OTP input
                <div>
                  <label
                    htmlFor="recipientEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Recipient's Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="recipientEmail"
                      value={recipientEmail}
                      className="block w-full pl-10 pr-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm opacity-75"
                      disabled
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
              {/* Confirm email input - only show when not in OTP mode */}
              {!showOtpInput && (
                <div>
                  <label
                    htmlFor="confirmEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Confirm Recipient's Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="confirmEmail"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2.5 rounded-md border ${
                        confirmEmail &&
                        recipientEmail &&
                        confirmEmail !== recipientEmail
                          ? "border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                          : confirmEmail &&
                            recipientEmail &&
                            confirmEmail === recipientEmail
                          ? "border-green-300 dark:border-green-500 focus:ring-green-500 focus:border-green-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2`}
                      placeholder="Confirm recipient's email address"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {confirmEmail && recipientEmail ? (
                        confirmEmail === recipientEmail ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {confirmEmail &&
                    recipientEmail &&
                    confirmEmail !== recipientEmail && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        Email addresses do not match
                      </p>
                    )}
                </div>
              )}
              {/* Error/Success messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md flex items-start"
                  >
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-md flex items-start"
                  >
                    <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Submit button */}
              {/* 5. ADD THE OTP UI SECTION */}
              {/* Add this code right before your Submit button in the form */}
              {/* OTP Input Section */}
              <AnimatePresence>
                {showOtpInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6"
                  >
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="otp"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Enter OTP
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={handleOtpChange}
                            className={`block w-full px-4 py-3 text-center font-mono text-lg rounded-md border ${
                              otpError
                                ? "border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2`}
                            placeholder="Enter 8-character OTP"
                            maxLength={8}
                            pattern="[A-Z0-9]{8}"
                            required
                            disabled={isVerifyingOtp}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Please enter the 8-character OTP sent to your
                          registered phone number. Use only uppercase letters
                          and numbers.
                        </p>

                        {otpError && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {otpError}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isSubmitting || isVerifyingOtp}
                          className="inline-flex items-center text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-lighter focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Resend OTP
                        </button>

                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isVerifyingOtp || otp.length !== 8}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isVerifyingOtp ? (
                            <>
                              <LoadingSpinner size="sm" />
                              <span className="ml-2">Verifying...</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-5 w-5 mr-2" />
                              Verify OTP
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Then, modify your submit button to only show when OTP section is not visible */}
              {!showOtpInput && (
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !selectedDevice ||
                      !recipientEmail ||
                      !confirmEmail ||
                      recipientEmail !== confirmEmail
                    }
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Transfer Ownership
                      </>
                    )}
                  </motion.button>
                </div>
              )}
              {/* <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !selectedDevice ||
                    !recipientEmail ||
                    !confirmEmail ||
                    recipientEmail !== confirmEmail
                  }
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Transfer Ownership
                    </>
                  )}
                </motion.button>
              </div> */}
            </form>
          )}
        </div>

        {/* Information panel */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Important Information
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>
                The recipient must have a Guardget account to receive the
                device.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>
                They will receive an email with instructions to accept the
                transfer.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>The transfer must be accepted within 21 days.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>You will be notified once the transfer is complete.</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default TransferDevicePage;
