import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, RefreshCw, ShieldAlert } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { deviceApi } from "../api/devices";

interface OtpVerificationProps {
  registrationToken: string;
  onSuccess: (response: any) => void;
  onError: (error: string | null) => void;
  onSessionExpired: () => void; // New callback for session expiration
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  registrationToken,
  onSuccess,
  onError,
  onSessionExpired,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase for consistency
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setOtp(value);

    // Clear any previous OTP errors when the user types
    if (otpError) {
      setOtpError(null);
    }
  };

  // Check for session expiration or invalid OTP
  const checkForSessionExpiration = (error: string): boolean => {
    const lowerCaseError = error.toLowerCase();
    if (
      lowerCaseError.includes("jwt expired") ||
      lowerCaseError.includes("session expired") ||
      lowerCaseError.includes("unauthorized") ||
      lowerCaseError.includes("authentication failed") ||
      lowerCaseError.includes("invalid token")
    ) {
      // Clear the OTP token
      localStorage.removeItem("otprefreshtoken");
      onSessionExpired();
      return true;
    }

    // Check for invalid OTP attempts
    if (
      lowerCaseError.includes("invalid otp") ||
      lowerCaseError.includes("incorrect otp") ||
      lowerCaseError.includes("otp mismatch")
    ) {
      // Don't trigger session expiration, just show error
      return false;
    }

    return false;
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 8) {
      setOtpError("Please enter a valid 8-character OTP");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const token =
        localStorage.getItem("otprefreshtoken") || registrationToken;
      const response = await deviceApi.verifyDeviceTransferOtp(otp, token);

      if (response.status === "success") {
        localStorage.removeItem("otprefreshtoken");
        // Call the success callback to complete the transfer
        onSuccess(response);
      } else {
        // OTP verification failed
        const errorMessage =
          response.message || "Invalid OTP. Please try again.";

        if (checkForSessionExpiration(errorMessage)) {
          // Session expired, handled in the checkForSessionExpiration function
        } else {
          setOtpError(errorMessage);
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to verify OTP. Please try again.";

      if (checkForSessionExpiration(errorMessage)) {
        // Session expired, handled in the checkForSessionExpiration function
      } else {
        setOtpError(errorMessage);
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle resending OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    const token = localStorage.getItem("otprefreshtoken") || registrationToken;
    if (!token) {
      onSessionExpired();
      return;
    }

    setIsResendingOtp(true);
    setOtpError(null);

    try {
      const response = await deviceApi.resendDevicetransferOtp(token);

      if (response.status === "success") {
        // Start countdown timer (30 seconds)
        setCountdown(30);

        // Update success message via parent component
        onError(null);
        onSuccess("OTP has been resent to your registered phone number.");
      } else {
        const errorMessage = response.message || "Failed to resend OTP";

        if (checkForSessionExpiration(errorMessage)) {
          // Session expired, handled in the checkForSessionExpiration function
        } else {
          setOtpError(errorMessage);
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to resend OTP. Please try again.";

      if (checkForSessionExpiration(errorMessage)) {
        // Session expired, handled in the checkForSessionExpiration function
      } else {
        setOtpError(errorMessage);
      }
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Format OTP input for better readability
  const formatOtpInput = (otp: string): string => {
    // Add a space after every 4 characters for better readability
    if (otp.length > 4) {
      return `${otp.slice(0, 4)} ${otp.slice(4)}`;
    }
    return otp;
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6"
    >
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex items-start">
          <ShieldAlert className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-600 dark:text-blue-400">
            An OTP has been sent to your registered key holder's phone number. Please enter
            it below to complete the transfer.
          </p>
        </div>

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
              value={formatOtpInput(otp)}
              onChange={handleOtpChange}
              className={`block w-full px-4 py-3 text-center font-mono text-lg rounded-md border ${
                otpError
                  ? "border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2`}
              placeholder="XXXX XXXX"
              maxLength={9} // 8 chars + 1 space
              autoComplete="one-time-code"
              required
              disabled={isVerifyingOtp}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please enter the 8-character OTP sent to your registered phone
            number. Use only uppercase letters and numbers.
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
            disabled={isResendingOtp || isVerifyingOtp || countdown > 0}
            className="inline-flex items-center text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-lighter focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResendingOtp ? (
              <>
                <LoadingSpinner size="xs" />
                <span className="ml-1">Resending...</span>
              </>
            ) : countdown > 0 ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Resend OTP in {countdown}s
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Resend OTP
              </>
            )}
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
  );
};

export default OtpVerification;
