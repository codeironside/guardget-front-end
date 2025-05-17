import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, AlertTriangle } from "lucide-react";

import DeviceSelection from "../../components/Deviceselection";
import RecipientForm from "../../components/RecipientForm";
import OtpVerification from "../../components/OtpVerification";
import StatusMessage from "../../components/StatusMessage";
import InfoPanel from "../../components/InfoPanel";
import EmptyDevicesMessage from "../../components/EmptyDevicesMessage";
import TransferReasonSelector from "../../components/TransferReasonSelector";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

import { deviceApi, ApiResponse } from "../../api/devices";


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

const TransferDevicePage: React.FC = () => {
  // State
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [registrationToken, setRegistrationToken] = useState<string>("");

  // New state for transfer reason
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  // Load devices on mount
  useEffect(() => {
    loadDevices();
  }, []);

  // Load user's devices
  const loadDevices = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await deviceApi.getAll();
      if (response.status === "success" && response.data) {
        setDevices(response.data);
      } else {
        setError("Failed to load your devices");
      }
    } catch (error: any) {
      console.error("Error fetching devices:", error);
      setError("Failed to load your devices");
    } finally {
      setLoading(false);
    }
  };

  // Get the actual transfer reason text to send to the API
  const getTransferReason = (): string => {
    if (selectedReason === "other" && customReason.trim()) {
      return customReason.trim();
    }

    // Map reason IDs to readable text
    const reasonMap: Record<string, string> = {
      gift: "Gift",
      sold: "Sold",
      transfer_ownership: "Transfer Ownership",
    };

    return reasonMap[selectedReason] || selectedReason;
  };

  // Handle form submission to initiate OTP
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Form validation
    if (!selectedDevice) {
      setError("Please select a device to transfer");
      return;
    }

    if (!recipientEmail || !confirmEmail) {
      setError("Please enter and confirm the recipient's email address");
      return;
    }

    if (recipientEmail !== confirmEmail) {
      setError("Email addresses do not match");
      return;
    }

    if (!selectedReason) {
      setError("Please select a reason for transfer");
      return;
    }

    if (selectedReason === "other" && !customReason.trim()) {
      setError("Please enter a reason for transfer");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Request the OTP - passing the deviceId correctly
      const otpResponse = await deviceApi.transferDeviceOtp(selectedDevice);

      if (otpResponse.status === "success" && otpResponse.registrationToken) {
        localStorage.setItem("otprefreshtoken", otpResponse.registrationToken);
        setRegistrationToken(otpResponse.registrationToken);
        setShowOtpInput(true);
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

  // Handle OTP verification success
  const handleOtpSuccess = async (response: ApiResponse): Promise<void> => {
    // If this is just a resend OTP success message, only update the success message
    if (typeof response === "string") {
      setSuccess(response);
      return;
    }

    // Handle successful OTP verification - proceed with transfer
    try {
      const transferResponse = await deviceApi.transferOwnership(
        selectedDevice,
        recipientEmail,
        getTransferReason() // Send the transfer reason
      );

      if (transferResponse.status === "success") {
        // Clear OTP section and reset the form
        setShowOtpInput(false);
        setSuccess(
          "Device transfer completed successfully. The recipient will be notified."
        );

        // Reset form
        setSelectedDevice("");
        setRecipientEmail("");
        setConfirmEmail("");
        setRegistrationToken("");
        setSelectedReason("");
        setCustomReason("");

        // Reload devices to reflect the changes
        loadDevices();

        // Show toast notification
        toast.success("Device transfer completed successfully!");
      } else {
        setError(
          transferResponse.message || "Failed to complete device transfer"
        );
      }
    } catch (error: any) {
      setError(error.message || "Failed to complete device transfer");
    }
  };

  // Handle session expiration
  const handleSessionExpired = (): void => {
    // Clear token and OTP UI
    localStorage.removeItem("otprefreshtoken");
    setShowOtpInput(false);
    setError("Your session has expired. Please restart the transfer process.");

    // Show toast notification
    toast.error("Session expired. Please restart the process.");
  };

  // Show loading spinner when loading devices
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
            <EmptyDevicesMessage />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Session expired warning */}
              {error && error.includes("session expired") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4 flex items-start"
                >
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400">
                      Session Expired
                    </h3>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      Your session has expired. Please restart the transfer
                      process.
                    </p>
                  </div>
                </motion.div>
              )}

              <DeviceSelection
                devices={devices}
                selectedDevice={selectedDevice}
                setSelectedDevice={setSelectedDevice}
                disabled={showOtpInput}
              />

              <RecipientForm
                recipientEmail={recipientEmail}
                setRecipientEmail={setRecipientEmail}
                confirmEmail={confirmEmail}
                setConfirmEmail={setConfirmEmail}
                showOtpInput={showOtpInput}
              />

              {/* Transfer reason selector component */}
              <TransferReasonSelector
                selectedReason={selectedReason}
                setSelectedReason={setSelectedReason}
                customReason={customReason}
                setCustomReason={setCustomReason}
                disabled={showOtpInput}
              />

              <StatusMessage error={error} success={success} />

              {showOtpInput ? (
                <OtpVerification
                  registrationToken={registrationToken}
                  onSuccess={handleOtpSuccess}
                  onError={setError}
                  onSessionExpired={handleSessionExpired}
                />
              ) : (
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !selectedDevice ||
                      !recipientEmail ||
                      !confirmEmail ||
                      recipientEmail !== confirmEmail ||
                      !selectedReason ||
                      (selectedReason === "other" && !customReason.trim())
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
            </form>
          )}
        </div>

        <InfoPanel />
      </motion.div>
    </div>
  );
};

export default TransferDevicePage;
