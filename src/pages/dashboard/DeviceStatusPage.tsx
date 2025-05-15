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
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";

// Define transfer history types based on backend response
interface TransferUser {
  id: string;
  username: string;
  email: string;
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

// Update DeviceStatus interface to include transfer history
interface DeviceStatus {
  status: "clean" | "stolen" | "missing";
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

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
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
          status: deviceData.status || "clean",
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
          status: "clean",
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

  // Format names from user objects
  const formatUserName = (user?: TransferUser) => {
    if (!user) return "Unknown";

    if (user.firstName || user.surName) {
      return [user.firstName, user.middleName, user.surName]
        .filter(Boolean)
        .join(" ");
    }

    return user.username || user.email || "Unknown";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Device Verification System
          </h1>
        </div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleCheck} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Identifier Type
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-primary"
                    value="imei"
                    checked={identifierType === "imei"}
                    onChange={() => setIdentifierType("imei")}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    IMEI (Phones)
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-primary"
                    value="sn"
                    checked={identifierType === "sn"}
                    onChange={() => setIdentifierType("sn")}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Serial Number (Laptops)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {identifierType === "imei" ? "IMEI Number" : "Serial Number"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {identifierType === "imei" ? (
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder={
                    identifierType === "imei"
                      ? "Enter 15-digit IMEI number"
                      : "Enter device serial number"
                  }
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {identifierType === "imei"
                  ? "You can find the IMEI by dialing *#06# on your phone or checking in the settings."
                  : "The serial number is usually on the bottom of the laptop or in system information."}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md flex items-start"
              >
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={isChecking || !identifier}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isChecking ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Verify Device
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden`}
            >
              {/* Status Banner */}
              <div
                className={`p-4 flex items-center ${
                  result.status === "clean"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : result.status === "missing"
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                }`}
              >
                <div
                  className={`rounded-full p-2 mr-4 ${
                    result.status === "clean"
                      ? "bg-green-100 dark:bg-green-800"
                      : result.status === "missing"
                      ? "bg-amber-100 dark:bg-amber-800"
                      : "bg-red-100 dark:bg-red-800"
                  }`}
                >
                  {result.status === "clean" ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <AlertTriangle className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {result.status === "clean"
                      ? "Device is Clean"
                      : result.status === "missing"
                      ? "Device Reported Missing"
                      : "Device Reported Stolen"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {result.status === "clean"
                      ? "This device has not been reported as lost or stolen."
                      : `This device has been reported as ${result.status}. Please contact authorities if you encounter this device.`}
                  </p>
                </div>
              </div>

              {/* Device Details */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Device Name
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {result.deviceName}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Model
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {result.deviceModel}
                      </p>
                    </div>

                    {result.serialNumber && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Serial Number
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium font-mono">
                          {result.serialNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {result.imei1 && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          IMEI 1
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium font-mono">
                          {result.imei1}
                        </p>
                      </div>
                    )}

                    {result.imei2 && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          IMEI 2
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium font-mono">
                          {result.imei2}
                        </p>
                      </div>
                    )}

                    {result.status !== "clean" && result.reportedDate && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Reported Date
                        </label>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-gray-900 dark:text-white font-medium">
                            {result.reportedDate}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {result.status !== "clean" && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    {result.location && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                          Last Known Location
                        </label>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-900 dark:text-white">
                            {result.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {result.user && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                          Owner Information
                        </label>
                        <div className="flex items-start">
                          {result.user.imageurl ? (
                            <img
                              src={result.user.imageurl}
                              alt="Owner"
                              className="h-10 w-10 rounded-full mr-3 object-cover border-2 border-gray-200 dark:border-gray-700"
                            />
                          ) : (
                            <User className="h-10 w-10 text-gray-400 mr-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-full" />
                          )}
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {result.user.username || "Not specified"}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {result.user.email || "No contact information"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Transfer History Section */}
                {result.transferHistory && result.transferHistory.length > 0 ? (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      className="flex w-full items-center justify-between text-left text-sm font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light py-2"
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
                            {result.transferHistory.map((transfer, index) => (
                              <motion.div
                                key={transfer._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    Transfer #
                                    {result.transferHistory!.length - index}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(
                                      transfer.transferDate
                                    ).toLocaleDateString()}
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="flex flex-col">
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                      From
                                    </label>
                                    <div className="flex items-center">
                                      {transfer.from.imageurl ? (
                                        <img
                                          src={transfer.from.imageurl}
                                          alt={formatUserName(transfer.from)}
                                          className="h-8 w-8 rounded-full mr-2"
                                        />
                                      ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2">
                                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                          {formatUserName(transfer.from)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {transfer.from.email}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col">
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                      To
                                    </label>
                                    <div className="flex items-center">
                                      {transfer.to.imageurl ? (
                                        <img
                                          src={transfer.to.imageurl}
                                          alt={formatUserName(transfer.to)}
                                          className="h-8 w-8 rounded-full mr-2"
                                        />
                                      ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2">
                                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                          {formatUserName(transfer.to)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {transfer.to.email}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-2 text-xs">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                                      transfer.status === "completed"
                                        ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                                        : "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400"
                                    }`}
                                  >
                                    {transfer.status}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : result.id ? (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <History className="h-5 w-5 mr-2" />
                      <span className="text-sm">
                        No transfer history available
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DeviceStatusPage;
