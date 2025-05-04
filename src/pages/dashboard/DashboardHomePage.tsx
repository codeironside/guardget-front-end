import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Smartphone,
  Shield,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { format } from "date-fns";
import { authApi } from "../../api/auth";

interface UserDetails {
  _id: string;
  username: string;
  firstName: string;
  middleName: string;
  surName: string;
  role: string;
  country: string;
  stateOfOrigin: string;
  phoneNumber: string;
  keyholderPhone1: string;
  keyholderPhone2: string;
  email: string;
  emailVerified: boolean;
  subActive: boolean;
  createdAt: string;
  updatedAt: string;
  subActiveTill: string;
  subId: string;
  subscription: string;
}

interface FinancialSummary {
  totalSpent: number;
  receiptCount: number;
  lastPayment: string;
  averagePayment: number;
}

interface ApiResponseData {
  userDetails: UserDetails;
  devices: any[];
  financialSummary: FinancialSummary;
}

interface ApiResponse {
  status: "success" | "error";
  data: ApiResponseData;
}

const DashboardHomePage: React.FC = () => {
  const [userData, setUserData] = useState<ApiResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await authApi.getDashboard();
        if (response.status === "success") {
          setUserData(response.data);
        }
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error bg-opacity-10 text-error rounded-md">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-white mb-2">
          Welcome back, {userData?.userDetails.firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's an overview of your device protection status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Registered Devices
              </p>
              <h3 className="text-2xl font-bold text-secondary dark:text-white">
                {userData?.devices?.length || 0}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/my-devices"
              className="text-primary text-sm font-medium flex items-center hover:underline"
            >
              View all devices
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-success bg-opacity-10 p-3 rounded-full mr-4">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Subscription Status
              </p>
              <h3 className="text-2xl font-bold text-secondary dark:text-white">
                {userData?.userDetails.subActive ? "Active" : "Inactive"}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/subscriptions"
              className="text-primary text-sm font-medium flex items-center hover:underline"
            >
              Manage subscription
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-warning bg-opacity-10 p-3 rounded-full mr-4">
              <CreditCard className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total Spent
              </p>
              <h3 className="text-2xl font-bold text-secondary dark:text-white">
                ₦{userData?.financialSummary?.totalSpent?.toLocaleString() || 0}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/receipts"
              className="text-primary text-sm font-medium flex items-center hover:underline"
            >
              View receipts
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-error bg-opacity-10 p-3 rounded-full mr-4">
              <AlertTriangle className="h-6 w-6 text-error" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Last Payment
              </p>
              <h3 className="text-2xl font-bold text-secondary dark:text-white">
                {userData?.financialSummary?.lastPayment
                  ? format(
                      new Date(userData.financialSummary.lastPayment),
                      "MMM d, yyyy"
                    )
                  : "N/A"}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/subscriptions"
              className="text-primary text-sm font-medium flex items-center hover:underline"
            >
              View plans
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-secondary dark:text-white">
              Subscription Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <p className="font-medium text-secondary dark:text-white">
                  {userData?.userDetails.subActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Valid Until
                </p>
                <p className="font-medium text-secondary dark:text-white">
                  {userData?.userDetails.subActiveTill
                    ? format(
                        new Date(userData.userDetails.subActiveTill),
                        "MMMM d, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Receipts
                </p>
                <p className="font-medium text-secondary dark:text-white">
                  {userData?.financialSummary?.receiptCount || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average Payment
                </p>
                <p className="font-medium text-secondary dark:text-white">
                  ₦
                  {userData?.financialSummary?.averagePayment?.toLocaleString() ||
                    0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-secondary dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <Link
                to="/dashboard/register-device"
                className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-secondary dark:text-white">
                  Register Device
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
              <Link
                to="/dashboard/report-device"
                className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-error bg-opacity-10 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-4 w-4 text-error" />
                </div>
                <span className="text-sm font-medium text-secondary dark:text-white">
                  Report Device
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
              <Link
                to="/dashboard/device-status"
                className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-warning bg-opacity-10 p-2 rounded-full mr-3">
                  <Shield className="h-4 w-4 text-warning" />
                </div>
                <span className="text-sm font-medium text-secondary dark:text-white">
                  Check Status
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
