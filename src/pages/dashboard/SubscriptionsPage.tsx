import React, { useState, useEffect } from "react";
import { subscriptionApi, Subscription } from "../../api/subscriptions";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Shield,
  Check,
  AlertCircle,
  Truck,
  MapPin,
  Headphones,
  Ban,
  Star,
  Clock,
  Search,
  Phone,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const SubscriptionsPage = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [duration, setDuration] = useState({ unit: "month", value: 1 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchParams] = useSearchParams();
  const verificationStarted = React.useRef(false);

  // Cross-plan services that are available with all subscriptions
  const crossPlanServices = [
    {
      icon: Truck,
      title: "Courier Service",
      description:
        "Free courier service to return recovered stolen phones to your location",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    // {
    //   icon: MapPin,
    //   title: "Enhanced Mobile Tracking",
    //   description:
    //     "Advanced GPS tracking with real-time location updates and movement alerts",
    //   color: "text-green-600",
    //   bgColor: "bg-green-100 dark:bg-green-900/20",
    // },
    {
      icon: Headphones,
      title: "Priority Recovery Assistance",
      description:
        "24/7 priority support for phone recovery with dedicated recovery specialists",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      icon: Ban,
      title: "Anti-Sale Protection",
      description:
        "Automatic blacklisting to prevent sale of stolen and missing devices",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      icon: Search,
      title: "Device Recovery Network",
      description:
        "Access to our nationwide network of recovery agents and law enforcement partnerships",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      icon: Phone,
      title: "Emergency Hotline",
      description:
        "Instant access to emergency response team for immediate device theft reporting",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
    },
  ];

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference && !verificationStarted.current) {
      verificationStarted.current = true;
      verifyPaymentReference(reference);
    }
  }, [searchParams]);

  const verifyPaymentReference = async (reference: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      const response = await subscriptionApi.verifyPayment(reference);

      if (response.status === "success") {
        toast.success("Payment verified successfully!");

        await fetchSubscriptions();

        const url = new URL(window.location.href);
        url.searchParams.delete("reference");
        window.history.replaceState({}, "", url.toString());

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
      verificationStarted.current = false;
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setError(null);
      const response = await subscriptionApi.getAll();
      if (response.status === "success") {
        setSubscriptions(response.data);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      setIsProcessing(true);
      setError(null);

      const response = await subscriptionApi.initializePayment({
        subId: selectedPlan,
        duration: duration.value,
        durationUnit: `${duration.unit}s`,
      });

      if (response.status === "success") {
        const redirectUrl = new URL(response.data.authorizationUrl);
        window.location.href = redirectUrl.toString();
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotalPrice = () => {
    const selectedSubscription = subscriptions.find(
      (p) => p._id === selectedPlan
    );
    if (!selectedSubscription) return 0;

    return (
      selectedSubscription.price *
      duration.value *
      (duration.unit === "year" ? 12 : 1)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Subscription Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {user?.subActive
              ? `Your current subscription is active until ${new Date(
                  user.subActiveTill!
                ).toLocaleDateString()}`
              : "Choose a plan to protect your devices with comprehensive security services"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      {isProcessing && (
        <div className="mb-8 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-4 rounded-md flex items-center">
          <LoadingSpinner size="sm" />
          <p className="ml-2">Processing payment verification...</p>
        </div>
      )}

      {searchParams.get("reference") && !isProcessing && !error && (
        <div className="mb-8 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 p-4 rounded-md flex items-center">
          <Check className="h-5 w-5 mr-2" />
          <p>
            Payment completed successfully! Your subscription has been updated.
          </p>
        </div>
      )}

      {/* Premium Services Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Premium Security Services
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Included with all subscription plans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {crossPlanServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Service Highlights */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-6 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Why Choose Our Premium Services?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Average 48-hour recovery time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>95% successful device recovery rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>24/7 dedicated support team</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Nationwide coverage network</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Choose Your Protection Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((plan) => (
            <div
              key={plan._id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                selectedPlan === plan._id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary/30"
              }`}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">
                    ₦{plan.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    /month
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Protect up to {plan.NoOfDevices} devices
                  </span>
                </div>
                {plan.description && (
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {plan.description}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    All premium security services included
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Priority recovery assistance
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlan(plan._id)}
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedPlan === plan._id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {selectedPlan === plan._id ? "Selected" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Subscription Duration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={duration.value}
                onChange={(e) =>
                  setDuration((prev) => ({
                    ...prev,
                    value: Math.max(
                      1,
                      Math.min(60, parseInt(e.target.value) || 1)
                    ),
                  }))
                }
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Duration"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <select
                value={duration.unit}
                onChange={(e) =>
                  setDuration((prev) => ({
                    ...prev,
                    unit: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isProcessing}
              >
                <option value="month">Months</option>
                <option value="year">Years</option>
              </select>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-primary">
                ₦{calculateTotalPrice().toLocaleString()}
              </span>
            </div>
            {duration.unit === "year" && (
              <p className="text-sm text-green-600 dark:text-green-400">
                💰 Save money with yearly billing!
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Includes all premium services: courier delivery, enhanced
                tracking, 24/7 support, and anti-sale protection
              </p>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium text-lg shadow-lg hover:shadow-xl"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" color="text-white" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              `Proceed to Payment (₦${calculateTotalPrice().toLocaleString()})`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
