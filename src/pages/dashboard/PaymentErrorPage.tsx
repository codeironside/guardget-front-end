import React, { useState, useEffect } from "react";
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  Coffee,
  Heart,
} from "lucide-react";

const PaymentErrorPage: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(8);
  const [funFact, setFunFact] = useState<number>(0);

  // Get message from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const message: string =
    urlParams.get("message") || "Payment failed. Please try again.";

  const funFacts: string[] = [
    "Did you know? The first online payment was made in 1994 for a Sting CD! 🎵",
    "Fun fact: Your wallet is probably feeling lighter already! 💸",
    "Random thought: Even Superman probably had payment issues once! 🦸‍♂️",
    "Silver lining: At least you didn't accidentally buy 1000 rubber ducks! 🦆",
    "Bright side: Your card is just being extra cautious - like a digital mom! 👩",
    "Consider this: Your money is just playing hard to get! 💕",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev: number) => {
        if (prev <= 1) {
          // Redirect to subscriptions page
          window.location.href = "/dashboard/subscriptions";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Rotate fun facts every 2 seconds
    const factTimer = setInterval(() => {
      setFunFact((prev: number) => (prev + 1) % funFacts.length);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(factTimer);
    };
  }, [funFacts.length]);

  const tryAgain = (): void => {
    window.location.href = "/dashboard/subscriptions";
  };

  const goToDashboard = (): void => {
    window.location.href = "/dashboard";
  };

  const contactSupport = (): void => {
    window.location.href = "/support";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-orange-50/50 to-primary/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating sad emojis */}
        <div
          className="absolute top-20 left-10 sm:top-32 sm:left-16"
          style={{ animation: "float 4s ease-in-out infinite" }}
        >
          <div className="text-xl sm:text-2xl opacity-20">😅</div>
        </div>
        <div
          className="absolute top-40 right-20 sm:top-48 sm:right-32"
          style={{ animation: "float 4s ease-in-out infinite 1s" }}
        >
          <div className="text-lg sm:text-xl opacity-20">🤷‍♂️</div>
        </div>
        <div
          className="absolute bottom-20 left-20 sm:bottom-32 sm:left-32"
          style={{ animation: "float 4s ease-in-out infinite 2s" }}
        >
          <div className="text-xl sm:text-2xl opacity-20">💳</div>
        </div>
        <div
          className="absolute bottom-40 right-10 sm:bottom-48 sm:right-16"
          style={{ animation: "float 4s ease-in-out infinite 3s" }}
        >
          <div className="text-lg sm:text-xl opacity-20">🔄</div>
        </div>

        {/* Floating AlertTriangle */}
        <div
          className="absolute top-32 right-32 sm:top-40 sm:right-40"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-error opacity-30" />
        </div>
      </div>

      <div className="text-center z-10 max-w-sm sm:max-w-md lg:max-w-lg mx-auto px-4 sm:px-6">
        {/* Error Icon with Animation */}
        <div className="relative mb-6 sm:mb-8">
          <div
            className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center shadow-2xl"
            style={{ animation: "wobble 2s ease-in-out infinite" }}
          >
            <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
          <div
            className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center"
            style={{ animation: "bounce 1s infinite" }}
          >
            <span className="text-xs sm:text-sm">💸</span>
          </div>
        </div>

        {/* Main Message */}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
          style={{ animation: "fadeInUp 0.8s ease-out" }}
        >
          😬 Oops! Payment Hiccup
        </h1>

        <p
          className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6"
          style={{ animation: "fadeInUp 0.8s ease-out 0.3s both" }}
        >
          {decodeURIComponent(message)}
        </p>

        {/* Fun Message */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 border-2 border-error/20 dark:border-error/30"
          style={{ animation: "slideUp 0.8s ease-out 0.6s both" }}
        >
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-error mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Don't worry, it happens!
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 sm:mb-4">
            Even the best of us have payment adventures. Your card might just be
            taking a coffee break! ☕
          </p>

          {/* Rotating Fun Facts */}
          <div className="bg-error/5 dark:bg-error/10 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 min-h-[50px] sm:min-h-[60px] flex items-center justify-center">
            <p className="text-xs sm:text-sm text-error dark:text-error italic transition-all duration-500 text-center">
              {funFacts[funFact]}
            </p>
          </div>

          {/* Common Solutions */}
          <div className="text-left space-y-2">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
              Quick fixes to try:
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <div className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>Check your card details and try again</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>Make sure you have sufficient funds</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>Try a different payment method</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>Contact your bank if the issue persists</span>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown and Navigation */}
        <div className="space-y-4">
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            Taking you back to try again in {countdown} seconds...
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={tryAgain}
              className="bg-gradient-to-r from-error to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              type="button"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span>Try Again</span>
            </button>

            <button
              onClick={goToDashboard}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-semibold flex items-center justify-center text-sm sm:text-base"
              type="button"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Support Option */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={contactSupport}
              className="text-xs sm:text-sm text-primary hover:text-primary-dark transition-colors flex items-center justify-center mx-auto"
              type="button"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>Need help? Contact our friendly support team</span>
            </button>
          </div>
        </div>

        {/* Fun Footer */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 sm:mt-8 italic">
          "Every expert was once a beginner, every pro was once amateur!" 🌟
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes wobble {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-3deg);
          }
          75% {
            transform: rotate(3deg);
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

export default PaymentErrorPage;
