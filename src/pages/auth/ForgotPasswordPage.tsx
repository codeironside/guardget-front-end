import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Lock, Eye, EyeOff, Shield, Clock } from "lucide-react";
import { authApi } from "../../api/auth";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<"phone" | "otp" | "password">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [resetToken, setResetToken] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds

  // Timer effect for OTP expiration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // OTP expired, reset to phone step
            setStep("phone");
            setMessage("OTP has expired. Please request a new one.");
            setMessageType("error");
            localStorage.removeItem("resetToken");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeRemaining]);

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await authApi.forgotPassword(phoneNumber, password);

      if (response.status === "success") {
        setMessage(response.message || "OTP sent; check your phone");
        setMessageType("success");
        setResetToken(response.resetToken);
        localStorage.setItem("resetToken", response.resetToken);
        setStep("otp");
        setTimeRemaining(900); // Reset timer to 15 minutes
      } else {
        setMessage(response.message || "Failed to send OTP. Please try again.");
        setMessageType("error");
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 8) {
      setMessage("OTP must be exactly 8 characters long.");
      setMessageType("error");
      return;
    }

    if (!/^[A-Z0-9]+$/.test(otp)) {
      setMessage("OTP must contain only capital letters and numbers.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // You'll need to create this API method for OTP verification
      const storedToken = localStorage.getItem("resetToken") || resetToken;
      const response = await authApi.resetPasswordWithToken(otp, storedToken);

      if (response.status === "success") {
        setMessage("Password reset completed successfully!");
        setMessageType("success");
        setStep("password");
        localStorage.removeItem("resetToken");
      } else {
        setMessage(response.message || "Invalid OTP. Please try again.");
        setMessageType("error");
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const storedToken = localStorage.getItem("resetToken") || resetToken;
      const response = await authApi.resetPasswordWithToken(
        storedToken,
        password
      );

      if (response.status === "success") {
        setMessage(
          "Password reset successful! You can now login with your new password."
        );
        setMessageType("success");
        localStorage.removeItem("resetToken");
        // Clear form after successful reset
        setPhoneNumber("");
        setPassword("");
        setOtp("");
        setStep("phone");
      } else {
        setMessage(
          response.message || "Password reset failed. Please try again."
        );
        setMessageType("error");
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 8 && /^[A-Z0-9]*$/.test(value)) {
      setOtp(value);
    }
  };

  const restartProcess = () => {
    setStep("phone");
    setPhoneNumber("");
    setOtp("");
    setPassword("");
    setMessage("");
    setResetToken("");
    localStorage.removeItem("resetToken");
    setTimeRemaining(900);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {step === "phone" && <Mail className="h-12 w-12 text-primary" />}
          {step === "otp" && <Shield className="h-12 w-12 text-primary" />}
          {step === "password" && <Lock className="h-12 w-12 text-primary" />}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === "phone" && "Reset your password"}
          {step === "otp" && "Verify OTP"}
          {step === "password" && "Password Reset Complete"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary-dark"
          >
            return to login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Phone Number and Password Step */}
          {step === "phone" && (
            <form className="space-y-6" onSubmit={handlePhoneSubmit}>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !phoneNumber || !password}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === "otp" && (
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter OTP
                  </label>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(timeRemaining)}
                  </div>
                </div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={8}
                    required
                    value={otp}
                    onChange={handleOtpChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-mono tracking-wider"
                    placeholder="XXXXXXXX"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter the 8-character OTP sent to your phone (capital letters
                  only)
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={restartProcess}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Resend OTP
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || otp.length !== 8}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Password Reset Step */}
          {step === "password" && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-700">
                  Password reset completed successfully! You can now login with
                  your new password.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800"
              >
                Go to Login
              </Link>
            </div>
          )}

          {message && (
            <div
              className={`mt-4 rounded-md p-4 ${
                messageType === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-sm ${
                  messageType === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {message}
              </p>
            </div>
          )}

          <div className="mt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {step === "phone" &&
                  "Enter your phone number and new password to initiate the reset process."}
                {step === "otp" &&
                  "Check your phone for the 8-character OTP code."}
                {step === "password" &&
                  "Your password has been successfully reset."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
