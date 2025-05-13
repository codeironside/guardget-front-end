import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";

// Update deviceApi interface to correctly handle query parameters
// This makes sure the searchDevice API method works correctly
const searchDeviceApi = async (query: string) => {
  try {
    const response = await deviceApi.searchDevice(`qparams=${query}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to check device status");
  }
};

interface DeviceStatus {
  status: "clean" | "stolen" | "missing";
  ownerImage?: string;
  deviceName: string;
  deviceModel: string;
  reportedDate?: string;
  location?: string;
  contactInfo?: string;
}

const DeviceStatusPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState<"imei" | "sn">("imei");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<DeviceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast.error("Please enter a valid identifier");
      return;
    }

    // Validate that the identifier meets the backend requirements
    // if (identifier.length !== 6) {
    //   toast.error("Identifier must be 6 characters in length");
    //   return;
    // }

    setIsChecking(true);
    setError(null);
    setResult(null);

    try {
      // Call the API with the correct query parameter name "qparams"
      const response = await searchDeviceApi(identifier);

      if (response.status === "success" && response.data) {
        const deviceData = response.data;

        // Map the API response to our UI model
        let deviceStatus: "clean" | "stolen" | "missing" = "clean";
        if (deviceData.status === "stolen") {
          deviceStatus = "stolen";
        } else if (deviceData.status === "missing") {
          deviceStatus = "missing";
        }

        setResult({
          status: deviceStatus,
          deviceName: deviceData.name || "Unknown Device",
          deviceModel: deviceData.Type || "Unknown Model",
          reportedDate: deviceData.updatedAt
            ? new Date(deviceData.updatedAt).toISOString().split("T")[0]
            : undefined,
          location: deviceData.location || "Unknown Location",
          contactInfo: deviceData.user
            ? `Contact: ${deviceData.user.email}`
            : "Contact local authorities",
        });
      } else if (response.status === "error") {
        throw new Error(response.message || "Failed to check device status.");
      } else if (!response.data) {
        // If no device found, show it as clean
        setResult({
          status: "clean",
          deviceName: "Unknown Device",
          deviceModel: "Unknown Model",
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Search className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Check Device Status
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleCheck} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Identifier Type
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
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
                <label className="inline-flex items-center">
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
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input-field"
                placeholder={
                  identifierType === "imei"
                    ? "Enter 15-digit IMEI number"
                    : "Enter device serial number"
                }
                required
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {identifierType === "imei"
                  ? "You can find the IMEI by dialing *#06# on your phone or checking in the settings."
                  : "The serial number is usually on the bottom of the laptop or in system information."}
              </p>
            </div>

            {error && (
              <div className="bg-error bg-opacity-10 text-error p-3 rounded-md">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isChecking || !identifier}
                className="btn-primary flex items-center"
              >
                {isChecking ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Check Status
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${
              result.status === "clean"
                ? "border-success"
                : result.status === "missing"
                ? "border-warning"
                : "border-error"
            }`}
          >
            <div className="flex items-center mb-6">
              <div
                className={`rounded-full p-2 mr-4 ${
                  result.status === "clean"
                    ? "bg-success bg-opacity-10 text-success"
                    : result.status === "missing"
                    ? "bg-warning bg-opacity-10 text-warning"
                    : "bg-error bg-opacity-10 text-error"
                }`}
              >
                {result.status === "clean" ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {result.status === "clean"
                    ? "Device is Clean"
                    : result.status === "missing"
                    ? "Device Reported Missing"
                    : "Device Reported Stolen"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {result.status === "clean"
                    ? "This device has not been reported as lost or stolen."
                    : `This device has been reported as ${result.status}.`}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Device Name
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {result.deviceName}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Model
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {result.deviceModel}
                  </p>
                </div>
              </div>

              {result.status !== "clean" && (
                <>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <label className="text-sm text-gray-500 dark:text-gray-400">
                            Reported Date
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {result.reportedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <label className="text-sm text-gray-500 dark:text-gray-400">
                            Location
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {result.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Contact Information
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {result.contactInfo}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DeviceStatusPage;
