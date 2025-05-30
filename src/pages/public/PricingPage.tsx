import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Check,
  Star,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  Crown,
  Building2,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { subscriptionApi } from "../../api/subscriptions";

// TypeScript interface matching your API response
interface Subscription {
  _id: string;
  name: string;
  NoOfDevices?: number;
  NoOfDecives?: number; // Handle typo in API
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await subscriptionApi.getAll();
        if (response.status === "success") {
          setSubscriptions(response.data);
        } else {
          setError("Failed to load subscription plans");
        }
      } catch (error: any) {
        setError(error.message || "Failed to load subscription plans");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Get plan icon based on plan name (more flexible for dynamic names)
  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("basic") || name.includes("student")) {
      return <Shield className="w-8 h-8 text-emerald-500" />;
    } else if (name.includes("premium") || name.includes("family")) {
      return <Crown className="w-8 h-8 text-amber-500" />;
    } else if (name.includes("admin") || name.includes("enterprise")) {
      return <Building2 className="w-8 h-8 text-purple-500" />;
    } else if (name.includes("extended") || name.includes("parents")) {
      return <Users className="w-8 h-8 text-blue-500" />;
    }
    return <Zap className="w-8 h-8 text-primary" />;
  };

  // Check if plan is popular/recommended (more flexible logic)
  const isPopularPlan = (subscription: Subscription) => {
    const name = subscription.name.toLowerCase();
    const deviceCount =
      subscription.NoOfDevices || subscription.NoOfDecives || 0;

    // Consider plans with moderate device count and reasonable price as popular
    return (
      name.includes("premium") ||
      name.includes("family") ||
      name.includes("extended") ||
      (deviceCount >= 3 &&
        deviceCount <= 10 &&
        subscription.price >= 1000 &&
        subscription.price <= 10000)
    );
  };

  // Get device count with fallback for typo in API
  const getDeviceCount = (subscription: Subscription): number => {
    return subscription.NoOfDevices || subscription.NoOfDecives || 0;
  };

  // Format price display (handle your currency values)
  const formatPrice = (price: number, cycle: "monthly" | "yearly") => {
    if (!price || price === 0) return "Free";

    // Convert price to a more readable format (assuming price is in cents or small currency unit)
    const displayPrice = cycle === "yearly" ? price * 10 : price; // 2 months free for yearly

    // Format large numbers properly
    if (displayPrice >= 1000000) {
      return `₦${(displayPrice / 1000000).toFixed(1)}M`;
    } else if (displayPrice >= 1000) {
      return `₦${(displayPrice / 1000).toFixed(0)}K`;
    }
    return `₦${displayPrice}`;
  };

  // Get billing suffix
  const getBillingSuffix = (price: number) => {
    if (!price || price === 0) return "";
    return billingCycle === "monthly" ? "/month" : "/year";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Shield className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unable to Load Pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Simple & Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your <span className="text-primary">Perfect Plan</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Protect your devices with our comprehensive security solutions.
              Start free and scale as you grow.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    billingCycle === "monthly"
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 relative ${
                    billingCycle === "yearly"
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {subscriptions.map((subscription, index) => {
              const isPopular = isPopularPlan(subscription);
              const deviceCount = getDeviceCount(subscription);

              return (
                <motion.div
                  key={subscription._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`relative ${isPopular ? "lg:scale-105" : ""}`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        <Star className="w-4 h-4 inline mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div
                    className={`relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border transition-all duration-300 overflow-hidden ${
                      isPopular
                        ? "border-primary dark:border-primary shadow-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    {/* Background Gradient for Popular Plan */}
                    {isPopular && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    )}

                    <div className="relative p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                          {getPlanIcon(subscription.name)}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
                          {subscription.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {subscription.description ||
                            `Perfect for ${subscription.name} users`}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-8">
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(subscription.price, billingCycle)}
                          </span>
                          <span className="text-xl text-gray-600 dark:text-gray-400 ml-1">
                            {getBillingSuffix(subscription.price)}
                          </span>
                        </div>
                        {billingCycle === "yearly" &&
                          subscription.price > 0 && (
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                              Save ₦{subscription.price * 2} per year
                            </p>
                          )}
                      </div>

                      {/* Features */}
                      <div className="space-y-4 mb-8">
                        {/* Device Count Feature */}
                        <div className="flex items-start">
                          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="ml-3 text-gray-600 dark:text-gray-300">
                            {deviceCount === 0
                              ? "Unlimited devices"
                              : `Up to ${deviceCount} devices`}
                          </span>
                        </div>

                        {/* Dynamic features based on plan name and device count */}
                        {subscription.name.toLowerCase().includes("admin") && (
                          <>
                            <div className="flex items-start">
                              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Full administrative access
                              </span>
                            </div>
                            <div className="flex items-start">
                              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Advanced security features
                              </span>
                            </div>
                            <div className="flex items-start">
                              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Priority support
                              </span>
                            </div>
                          </>
                        )}

                        {subscription.name
                          .toLowerCase()
                          .includes("premium") && (
                          <>
                            <div className="flex items-start">
                              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Advanced tracking features
                              </span>
                            </div>
                            <div className="flex items-start">
                              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Real-time alerts
                              </span>
                            </div>
                          </>
                        )}

                        {subscription.name.toLowerCase().includes("family") && (
                          <>
                            <div className="flex items-start">
                              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Multi-user management
                              </span>
                            </div>
                            <div className="flex items-start">
                              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Parental controls
                              </span>
                            </div>
                          </>
                        )}

                        {subscription.name
                          .toLowerCase()
                          .includes("student") && (
                          <>
                            <div className="flex items-start">
                              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Student discount included
                              </span>
                            </div>
                            <div className="flex items-start">
                              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Basic protection features
                              </span>
                            </div>
                          </>
                        )}

                        {/* Common features for all plans */}
                        <div className="flex items-start">
                          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="ml-3 text-gray-600 dark:text-gray-300">
                            Device registration & verification
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="ml-3 text-gray-600 dark:text-gray-300">
                            24/7 monitoring
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="ml-3 text-gray-600 dark:text-gray-300">
                            Email support
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          navigate(`/subscribe/${subscription._id}`)
                        }
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center group ${
                          isPopular
                            ? "bg-primary hover:bg-primary-dark text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white text-gray-900 dark:text-white"
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Enterprise Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="flex justify-center mb-6">
                <Users className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Need a Custom Solution?
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                For large organizations or unique requirements, we offer
                tailored enterprise solutions with dedicated support and custom
                integrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/contact")}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg inline-flex items-center justify-center"
                >
                  Contact Sales
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Schedule Demo
                </motion.button> */}
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Have questions? We've got answers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "Can I change my plan at any time?",
                  answer:
                    "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                },
                {
                  question: "Is there a free trial?",
                  answer:
                    "We offer a 14-day free trial on all paid plans. No credit card required to start.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, PayPal, and bank transfers for enterprise customers.",
                },
                {
                  question: "Can I cancel anytime?",
                  answer:
                    "Yes, you can cancel your subscription at any time. No cancellation fees or long-term commitments.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
