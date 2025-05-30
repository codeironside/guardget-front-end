import React, { useState, useEffect } from "react";
import { CheckCircle, Shield, Sparkles, ArrowRight, Zap } from "lucide-react";

const PaymentSuccessPage: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(5);
  const [showConfetti, setShowConfetti] = useState<boolean>(true);

  // Get message from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const message: string = urlParams.get("message") || "Payment successful!";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev: number) => {
        if (prev <= 1) {
          // Redirect to dashboard
          window.location.href = "/dashboard";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Hide confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(confettiTimer);
    };
  }, []);

  const goToDashboard = (): void => {
    window.location.href = "/dashboard";
  };

  const goToSubscriptions = (): void => {
    window.location.href = "/dashboard/subscriptions";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {showConfetti && (
          <>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-bounce opacity-70"
                style={{
                  backgroundColor: [
                    "#3b82f6",
                    "#1d4ed8",
                    "#2563eb",
                    "#1e40af",
                    "#3730a3",
                  ][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </>
        )}

        {/* Floating Shields */}
        <div
          className="absolute top-20 left-10 sm:top-32 sm:left-16"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary opacity-30" />
        </div>
        <div
          className="absolute top-40 right-20 sm:top-48 sm:right-32"
          style={{ animation: "float 3s ease-in-out infinite 1s" }}
        >
          <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary opacity-30" />
        </div>
        <div
          className="absolute bottom-20 left-20 sm:bottom-32 sm:left-32"
          style={{ animation: "float 3s ease-in-out infinite 2s" }}
        >
          <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-primary opacity-30" />
        </div>
      </div>

      <div className="text-center z-10 max-w-sm sm:max-w-md lg:max-w-lg mx-auto px-4 sm:px-6">
        {/* Success Icon with Animation */}
        <div className="relative mb-6 sm:mb-8">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center animate-bounce shadow-2xl">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
          <div
            className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center"
            style={{ animation: "spin 3s linear infinite" }}
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-800" />
          </div>
        </div>

        {/* Main Message */}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
          style={{ animation: "fadeInUp 0.8s ease-out" }}
        >
          🎉 Woo-hoo! Payment Successful!
        </h1>

        <p
          className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6"
          style={{ animation: "fadeInUp 0.8s ease-out 0.3s both" }}
        >
          {decodeURIComponent(message)}
        </p>

        {/* Fun Message */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 border-2 border-primary/20 dark:border-primary/30"
          style={{ animation: "slideUp 0.8s ease-out 0.6s both" }}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
            🛡️ Your devices are now protected!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 sm:mb-4">
            Like a digital bodyguard, but way cooler and without the sunglasses!
            😎
          </p>

          {/* Features Unlocked */}
          <div className="space-y-2 text-left">
            <div className="flex items-center text-xs sm:text-sm text-primary">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <span>Real-time device tracking activated</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-primary">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <span>Theft alerts are now armed and ready</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-primary">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <span>Recovery assistance at your fingertips</span>
            </div>
          </div>
        </div>

        {/* Countdown and Navigation */}
        <div className="space-y-4">
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            Taking you to your dashboard in {countdown} seconds...
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={goToDashboard}
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-primary-dark hover:to-primary transition-all duration-200 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              type="button"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
            </button>

            <button
              onClick={goToSubscriptions}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-semibold text-sm sm:text-base"
              type="button"
            >
              View Subscriptions
            </button>
          </div>
        </div>

        {/* Fun Footer */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 sm:mt-8 italic">
          "Money well spent!" - Your Future Self 💸✨
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;
