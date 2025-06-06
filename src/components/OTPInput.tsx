// components/OTPInput.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Phone } from "lucide-react";

interface OTPInputProps {
  onOtpComplete: (otp: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  onOtpComplete,
  isLoading,
  error,
}) => {
  const [otp, setOtp] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleOtpChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Safety checks to prevent errors
      if (!e || !e.target) {
        console.warn("Invalid event in OTP input");
        return;
      }

      let inputValue = "";
      try {
        inputValue = e.target.value || "";
      } catch (error) {
        console.error("Error getting input value:", error);
        inputValue = "";
      }

      // Process the input safely
      let processedValue = "";
      try {
        processedValue = inputValue
          .toString()
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .slice(0, 8);
      } catch (error) {
        console.error("Error processing OTP input:", error);
        processedValue = "";
      }

      setOtp(processedValue);

      // Auto-verify when 8 characters are entered
      if (processedValue.length === 8) {
        try {
          onOtpComplete(processedValue);
        } catch (error) {
          console.error("Error calling onOtpComplete:", error);
        }
      }
    },
    [onOtpComplete]
  );

  // Handle paste events
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      let pastedText = "";
      try {
        pastedText = e.clipboardData?.getData("text") || "";
      } catch (error) {
        console.error("Error getting pasted text:", error);
        return;
      }

      let processedValue = "";
      try {
        processedValue = pastedText
          .toString()
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .slice(0, 8);
      } catch (error) {
        console.error("Error processing pasted text:", error);
        return;
      }

      setOtp(processedValue);

      if (processedValue.length === 8) {
        try {
          onOtpComplete(processedValue);
        } catch (error) {
          console.error("Error calling onOtpComplete from paste:", error);
        }
      }
    },
    [onOtpComplete]
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <Phone className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Check your phone
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          We've sent an 8-character OTP to your primary phone number.
        </p>
      </div>

      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Enter OTP Code
        </label>
        <input
          ref={inputRef}
          type="text"
          id="otp"
          name="otp"
          value={otp}
          onChange={handleOtpChange}
          onPaste={handlePaste}
          className="block w-full px-3 py-3 text-center text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white tracking-widest"
          placeholder="ABC12XYZ"
          maxLength={8}
          disabled={isLoading}
          autoComplete="one-time-code"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Enter the 8-character code (uppercase letters and numbers).
        </p>
        {error && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
