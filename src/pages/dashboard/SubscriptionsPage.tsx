import React, { useState, useEffect } from "react";
import { subscriptionApi, Subscription } from "../../api/subscriptions";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Shield, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const verificationStarted = React.useRef(false);

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
        navigate("/dashboard/subscriptions", { replace: true });
        await fetchSubscriptions();
        window.location.href = "/dashboard/subscriptions";// Refresh data after verification
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
              : "Choose a plan to protect your devices"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-8 bg-error bg-opacity-10 text-error p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((plan) => (
          <div
            key={plan._id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 transition-all ${
              selectedPlan === plan._id
                ? "border-primary"
                : "border-transparent hover:border-gray-200"
            }`}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {plan.name}
            </h3>
            <p className="text-3xl font-bold text-primary mb-4">
              ₦{plan.price.toLocaleString()}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                /month
              </span>
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Up to {plan.NoOfDevices} devices</span>
              </li>
              {plan.description && (
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>{plan.description}</span>
                </li>
              )}
            </ul>
            <button
              onClick={() => setSelectedPlan(plan._id)}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                selectedPlan === plan._id
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Subscription Duration
          </h3>
          <div className="flex gap-4 mb-6">
            <input
              type="number"
              min="1"
              value={duration.value}
              onChange={(e) =>
                setDuration((prev) => ({
                  ...prev,
                  value: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
              className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Duration"
            />
            <select
              value={duration.unit}
              onChange={(e) =>
                setDuration((prev) => ({
                  ...prev,
                  unit: e.target.value,
                }))
              }
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="month">Months</option>
              <option value="year">Years</option>
            </select>
          </div>
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" color="text-white" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              `Proceed to Payment (₦${(
                subscriptions.find((p) => p._id === selectedPlan)?.price *
                duration.value *
                (duration.unit === "year" ? 12 : 1)
              ).toLocaleString()})`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
