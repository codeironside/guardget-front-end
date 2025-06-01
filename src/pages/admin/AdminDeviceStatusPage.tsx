import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Smartphone,
  CreditCard,
  History,
  ChevronDown,
  ChevronUp,
  Shield,
  XCircle,
  PauseCircle,
  ArrowRightCircle,
  AlertCircle,
  Info,
  Laptop,
  Hash,
  Eye,
  Clock,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";

// Define transfer history types based on backend response
interface TransferUser {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  firstName?: string;
  surName?: string;
  middleName?: string;
  imageurl?: string;
}

interface TransferHistory {
  _id: string;
  transferDate: string;
  status: string;
  from: TransferUser;
  to: TransferUser;
}

// Update DeviceStatus interface to include all possible statuses
interface DeviceStatus {
  status: "active" | "inactive" | "missing" | "stolen" | "transfer_pending";
  id: string;
  deviceName: string;
  deviceModel: string;
  serialNumber: string;
  imei1?: string;
  imei2?: string;
  reportedDate?: string;
  location?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    imageurl?: string;
  };
  transferHistory?: TransferHistory[];
}

// Update the API function to properly handle response
const searchDeviceApi = async (query: string) => {
  try {
    const response = await deviceApi.searchDevice(`qparams=${query}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to check device status");
  }
};

const DeviceStatusPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState<"imei" | "sn">("imei");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<DeviceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTransferHistory, setShowTransferHistory] = useState(false);

  const handleCheck = async () => {
    if (!identifier) {
      toast.error("Please enter a valid identifier");
      return;
    }

    setIsChecking(true);
    setError(null);
    setResult(null);
    setShowTransferHistory(false);

    try {
      const response = await searchDeviceApi(identifier);

      if (response.status === "success" && response.data) {
        const deviceData = response.data;

        // Map the API response to our UI model
        setResult({
          id: deviceData.id,
          status: deviceData.status || "active",
          deviceName: deviceData.name || "Unknown Device",
          deviceModel: deviceData.Type || "Unknown Model",
          serialNumber: deviceData.SN || "",
          imei1: deviceData.IMIE1 || deviceData.IMEI1,
          imei2: deviceData.IMEI2,
          reportedDate: deviceData.updatedAt
            ? new Date(deviceData.updatedAt).toLocaleDateString()
            : undefined,
          location: deviceData.location || "Unknown Location",
          user: deviceData.user,
          transferHistory: deviceData.transferHistory || [],
        });
      } else if (response.status === "error") {
        throw new Error(response.message || "Failed to check device status.");
      } else if (!response.data) {
        // If no device found, show it as clean
        setResult({
          id: "",
          status: "active",
          deviceName: "Unknown Device",
          deviceModel: "Unknown Model",
          serialNumber: "",
        });
        toast.info("No device found with the provided identifier.");
      }
    } catch (error: any) {
      setError(
        error.message || "Failed to check device status. Please try again."
      );
      toast.error(
        error.message || "Failed to check device status. Please try again."
      );
    } finally {
      setIsChecking(false);
    }
  };

  // Get status configuration
  const getStatusConfig = (status: DeviceStatus["status"]) => {
    const configs = {
      active: {
        icon: CheckCircle,
        title: "Device is Safe",
        description:
          "This device has not been reported as lost or stolen and is actively registered.",
        bgColor: "bg-success bg-opacity-10",
        textColor: "text-success",
        iconBg: "bg-success bg-opacity-20",
        priority: "safe",
      },
      inactive: {
        icon: PauseCircle,
        title: "Device is Inactive",
        description:
          "This device is registered but currently marked as inactive by the owner.",
        bgColor: "bg-gray-100 dark:bg-gray-700",
        textColor: "text-gray-600 dark:text-gray-300",
        iconBg: "bg-gray-200 dark:bg-gray-600",
        priority: "neutral",
      },
      missing: {
        icon: AlertTriangle,
        title: "Device Reported Missing",
        description:
          "This device has been reported as missing. If found, please contact the authorities or the owner.",
        bgColor: "bg-warning bg-opacity-10",
        textColor: "text-warning",
        iconBg: "bg-warning bg-opacity-20",
        priority: "warning",
      },
      stolen: {
        icon: XCircle,
        title: "Device Reported Stolen",
        description:
          "This device has been reported as stolen. Do not purchase or use this device. Contact authorities immediately.",
        bgColor: "bg-error bg-opacity-10",
        textColor: "text-error",
        iconBg: "bg-error bg-opacity-20",
        priority: "danger",
      },
      transfer_pending: {
        icon: ArrowRightCircle,
        title: "Transfer Pending",
        description:
          "This device is currently undergoing ownership transfer and is under 21-day review period.",
        bgColor: "bg-primary bg-opacity-10",
        textColor: "text-primary",
        iconBg: "bg-primary bg-opacity-20",
        priority: "info",
      },
    };

    return configs[status] || configs.active;
  };

  const formatUserName = (user?: TransferUser) => {
    if (!user) return "Unknown";
    if (user.firstName || user.surName) {
      return [user.firstName, user.middleName, user.surName]
        .filter(Boolean)
        .join(" ");
    }
    return user.username || user.email || "Unknown";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-primary bg-opacity-10 rounded-full mb-6"
            >
              <Shield className="h-10 w-10 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold text-secondary dark:text-white mb-4">
              Device Verification Center
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Verify the security status of any device using IMEI or serial
              number. Check if a device has been reported as stolen, missing, or
              is safely registered.
            </p>
          </div>

          {/* Search Form */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              {/* Identifier Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Choose Verification Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.label
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      identifierType === "imei"
                        ? "border-primary bg-primary bg-opacity-5"
                        : "border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value="imei"
                      checked={identifierType === "imei"}
                      onChange={() => setIdentifierType("imei")}
                    />
                    <div className="flex items-center">
                      <Smartphone className="h-6 w-6 text-primary mr-3" />
                      <div>
                        <div className="font-medium text-secondary dark:text-white">
                          IMEI Number
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          For smartphones and tablets
                        </div>
                      </div>
                    </div>
                  </motion.label>

                  <motion.label
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      identifierType === "sn"
                        ? "border-primary bg-primary bg-opacity-5"
                        : "border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value="sn"
                      checked={identifierType === "sn"}
                      onChange={() => setIdentifierType("sn")}
                    />
                    <div className="flex items-center">
                      <Laptop className="h-6 w-6 text-primary mr-3" />
                      <div>
                        <div className="font-medium text-secondary dark:text-white">
                          Serial Number
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          For laptops and computers
                        </div>
                      </div>
                    </div>
                  </motion.label>
                </div>
              </div>

              {/* Identifier Input */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {identifierType === "imei" ? "IMEI Number" : "Serial Number"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="input-field pl-12 text-lg"
                    placeholder={
                      identifierType === "imei"
                        ? "Enter 15-digit IMEI number (e.g., 354984074156834)"
                        : "Enter device serial number (e.g., C02XY1234567)"
                    }
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-start">
                  <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  {identifierType === "imei"
                    ? "Find IMEI by dialing *#06# on your phone or checking Settings > About Phone"
                    : "Find serial number on device label, system information, or original packaging"}
                </p>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-error bg-opacity-10 text-error p-4 rounded-lg flex items-start"
                  >
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="flex justify-center">
                <motion.button
                  onClick={handleCheck}
                  disabled={isChecking || !identifier}
                  className="btn btn-primary px-8 py-3 text-lg inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isChecking ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Verifying Device...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5 mr-2" />
                      Verify Device Status
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Status Banner */}
                {(() => {
                  const config = getStatusConfig(result.status);
                  const StatusIcon = config.icon;

                  return (
                    <div className={`${config.bgColor} p-6`}>
                      <div className="flex items-start">
                        <div
                          className={`${config.iconBg} rounded-full p-3 mr-4`}
                        >
                          <StatusIcon
                            className={`h-8 w-8 ${config.textColor}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`text-xl font-semibold ${config.textColor} mb-2`}
                          >
                            {config.title}
                          </h3>
                          <p className={`${config.textColor} opacity-90`}>
                            {config.description}
                          </p>
                          {(result.status === "missing" ||
                            result.status === "stolen") && (
                            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-current border-opacity-20">
                              <p className="text-sm font-medium">
                                ⚠️ Important: If you encounter this device,
                                please contact local authorities or the owner
                                immediately.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Device Details */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-secondary dark:text-white mb-6">
                    Device Information
                  </h4>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                          Device Name
                        </label>
                        <p className="text-secondary dark:text-white font-medium">
                          {result.deviceName}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                          Device Type
                        </label>
                        <p className="text-secondary dark:text-white font-medium capitalize">
                          {result.deviceModel}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {result.serialNumber && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                            Serial Number
                          </label>
                          <p className="text-secondary dark:text-white font-mono font-medium">
                            {result.serialNumber}
                          </p>
                        </div>
                      )}

                      {result.imei1 && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                            IMEI 1
                          </label>
                          <p className="text-secondary dark:text-white font-mono font-medium">
                            {result.imei1}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {result.imei2 && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                            IMEI 2
                          </label>
                          <p className="text-secondary dark:text-white font-mono font-medium">
                            {result.imei2}
                          </p>
                        </div>
                      )}

                      {result.reportedDate && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                            Last Updated
                          </label>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-secondary dark:text-white font-medium">
                              {formatDate(result.reportedDate)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Info for Non-Active Devices */}
                  {result.status !== "active" && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
                      {result.location && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                            Last Known Location
                          </label>
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-secondary dark:text-white">
                              {result.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.user && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                            Owner Information
                          </label>
                          <div className="flex items-start">
                            {result.user.imageurl ? (
                              <img
                                src={result.user.imageurl}
                                alt="Owner"
                                className="h-12 w-12 rounded-full mr-3 object-cover border-2 border-gray-200 dark:border-gray-700"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-full mr-3 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-secondary dark:text-white font-medium">
                                {result.user.username || "Not specified"}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {result.user.email || "No contact information"}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">+234
                                {result.user.phoneNumber ||
                                  "No contact information"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Transfer History Section */}
                  {result.transferHistory &&
                    result.transferHistory.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                        <motion.button
                          className="flex w-full items-center justify-between text-left font-medium text-secondary dark:text-white hover:text-primary dark:hover:text-primary py-2"
                          onClick={() =>
                            setShowTransferHistory(!showTransferHistory)
                          }
                          whileHover={{ x: 2 }}
                        >
                          <div className="flex items-center">
                            <History className="h-5 w-5 mr-2" />
                            <span>
                              Transfer History ({result.transferHistory.length})
                            </span>
                          </div>
                          {showTransferHistory ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </motion.button>

                        <AnimatePresence>
                          {showTransferHistory && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 space-y-4">
                                {result.transferHistory.map(
                                  (transfer, index) => (
                                    <motion.div
                                      key={transfer._id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                                    >
                                      <div className="flex justify-between items-start mb-3">
                                        <div className="text-sm font-medium text-secondary dark:text-white">
                                          Transfer #
                                          {result.transferHistory!.length -
                                            index}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {formatDate(transfer.transferDate)}
                                        </div>
                                      </div>

                                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                                            From
                                          </label>
                                          <div className="flex items-center">
                                            {transfer.from.imageurl ? (
                                              <img
                                                src={transfer.from.imageurl}
                                                alt={formatUserName(
                                                  transfer.from
                                                )}
                                                className="h-8 w-8 rounded-full mr-2"
                                              />
                                            ) : (
                                              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2">
                                                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                              </div>
                                            )}
                                            <div>
                                              <p className="text-sm font-medium text-secondary dark:text-white">
                                                {formatUserName(transfer.from)}
                                              </p>
                                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {transfer.from.email}
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                                            To
                                          </label>
                                          <div className="flex items-center">
                                            {transfer.to.imageurl ? (
                                              <img
                                                src={transfer.to.imageurl}
                                                alt={formatUserName(
                                                  transfer.to
                                                )}
                                                className="h-8 w-8 rounded-full mr-2"
                                              />
                                            ) : (
                                              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2">
                                                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                              </div>
                                            )}
                                            <div>
                                              <p className="text-sm font-medium text-secondary dark:text-white">
                                                {formatUserName(transfer.to)}
                                              </p>
                                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {transfer.to.email}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-xs">
                                        <span
                                          className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${
                                            transfer.status === "completed"
                                              ? "bg-success bg-opacity-10 text-success"
                                              : transfer.status === "pending"
                                              ? "bg-warning bg-opacity-10 text-warning"
                                              : "bg-error bg-opacity-10 text-error"
                                          }`}
                                        >
                                          {transfer.status}
                                        </span>
                                      </div>
                                    </motion.div>
                                  )
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center"
            >
              <div className="bg-success bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-secondary dark:text-white mb-2">
                Secure Verification
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our system checks against a comprehensive database of reported
                devices
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center"
            >
              <div className="bg-primary bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-secondary dark:text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get instant verification results with up-to-date device status
                information
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center"
            >
              <div className="bg-warning bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-warning" />
              </div>
              <h3 className="font-semibold text-secondary dark:text-white mb-2">
                Fraud Prevention
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Protect yourself from purchasing stolen or compromised devices
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeviceStatusPage;
