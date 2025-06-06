// pages/RegisterPage.tsx
import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { authApi } from "../../api/auth";
import toast from "react-hot-toast";

// Import our custom components
import { RegistrationForm } from "../../components/RegistrationForm";
import { OTPInput } from "../../components/OTPInput";
import LoadingSpinner from "../../components/LoadingSpinner";

// Import types
import { RegistrationFormData } from "../../types/registeration";

// Custom hook for registration logic
const useRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [registrationToken, setRegistrationToken] = useState<string>("");

  const submitRegistration = useCallback(
    async (formData: RegistrationFormData) => {
      setError(null);
      setIsLoading(true);

      try {
        // Prepare submission data
        const submissionData = { ...formData };

        
        if (!formData.middleName.trim()) {
          // Uncomment if backend doesn't accept empty middleName
          // delete (submissionData as any).middleName;
        }
        console.log("submission data 2", submissionData);

        const response = await authApi.register(submissionData);

        if (response.status === "success") {
          setRegistrationToken(response.registrationToken);
          setShowOtpInput(true);
          toast.success(response.message || "OTP sent successfully!");
        } else {
          const errorMessage =
            response.message || "Registration failed. Please try again.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred during registration.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  ); // Removed dependencies that were causing issues

  // Add the missing verifyOtp function
  const verifyOtp = useCallback(
    async (otp: string) => {
      if (isLoading || !otp || otp.length !== 8) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.verifyOtp({
          otp,
          registrationToken,
        });

        if (response.status === "success") {
          toast.success(
            response.message || "Registration completed successfully!"
          );
          navigate("/login");
        } else {
          const errorMessage = response.message || "OTP verification failed.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred during OTP verification.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [registrationToken, navigate, isLoading]
  );

  return {
    isLoading,
    error,
    showOtpInput,
    submitRegistration,
    verifyOtp, // Make sure this is returned
    setError,
  };
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    showOtpInput,
    submitRegistration,
    verifyOtp,
    setError,
  } = useRegistration();

  // Clear error when user starts interacting again
  const handleErrorDismiss = useCallback(() => {
    if (error) setError(null);
  }, [error, setError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 sm:top-8 sm:left-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-colors duration-200 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          aria-label="Go back to home page"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to Home</span>
        </button>

        <div className="text-center mt-16 sm:mt-0">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
            {showOtpInput ? "📱 Verify OTP" : "🚀 Create Your Account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-dark transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 transition-colors duration-300 border border-gray-200 dark:border-gray-700">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
                <button
                  onClick={handleErrorDismiss}
                  className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Conditional Content */}
          {showOtpInput ? (
            <div onClick={handleErrorDismiss}>
              <OTPInput
                onOtpComplete={verifyOtp}
                isLoading={isLoading}
                error={error}
              />
              {isLoading && (
                <div className="flex justify-center pt-4">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
          ) : (
            <div onClick={handleErrorDismiss}>
              <RegistrationForm
                onSubmit={submitRegistration}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
