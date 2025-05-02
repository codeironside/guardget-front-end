"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ConfettiEffect from "@/components/confetti-effect";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(8).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); // 1min 30sec
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, isVerified]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChange = (index: number, value: string) => {
    // Convert to uppercase for letters
    const uppercaseValue = value.toUpperCase();

    // Create a new array with the updated value
    const newOtp = [...otp];
    newOtp[index] = uppercaseValue;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 8).split("");

    // Fill the OTP fields with pasted data
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 8) {
        newOtp[index] = char.toUpperCase();
      }
    });

    setOtp(newOtp);

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 8) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[7]?.focus();
    }
  };

  const handleResendOtp = () => {
    setIsResending(true);

    // Simulate API call to resend OTP
    setTimeout(() => {
      setTimeLeft(90);
      setIsResending(false);
      toast({
        title: "OTP Resent",
        description:
          "A new OTP has been sent to your keyholder's phone number.",
      });
    }, 1500);
  };

  const handleVerify = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 8) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 8-character OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API verification
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);

      // Redirect to login page after showing success message
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Shield className="h-12 w-12 text-primary" />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">OTP Verification</CardTitle>
            <CardDescription>
              Enter the 8-character OTP sent to your keyholder's phone number
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {isVerified ? (
              <div className="text-center py-6">
                <ConfettiEffect />
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-500">
                  Verification Successful!
                </h3>
                <p className="text-muted-foreground">
                  Your account has been verified successfully. Redirecting to
                  login page...
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-8 gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="otp-input"
                      disabled={timeLeft === 0}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                    Time remaining:{" "}
                    <span className={timeLeft < 30 ? "text-red-500" : ""}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleResendOtp}
                    disabled={timeLeft > 0 || isResending}
                    className="p-0 h-auto"
                  >
                    {isResending ? "Resending..." : "Resend OTP"}
                  </Button>
                </div>

                <Button
                  onClick={handleVerify}
                  className="w-full"
                  disabled={
                    otp.join("").length !== 8 || isLoading || timeLeft === 0
                  }
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

                {timeLeft === 0 && (
                  <p className="text-sm text-red-500 mt-4 text-center">
                    OTP has expired. Please request a new one.
                  </p>
                )}
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center p-6 border-t">
            <p className="text-sm text-muted-foreground">
              The OTP is sent to your  phone number for security
              purposes.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
