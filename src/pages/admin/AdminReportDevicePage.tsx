import React, { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "../../components/LoadingSpinner";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";

enum DeviceStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MISSING = "missing",
  STOLEN = "stolen",
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface Device {
  id: string;
  name: string;
  model?: string;
  type?: string;
  Type?: string;
  status: DeviceStatus;
  SN: string;
  IMEI1?: string;
  IMEI2?: string;
  user?: User;
  createdAt?: string;
}

interface ReportDeviceRequest {
  deviceId: string;
  reportType: "missing" | "stolen";
  description: string;
  location: string;
}

const ReportDevicePage = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [selectedDeviceDetails, setSelectedDeviceDetails] =
    useState<Device | null>(null);
  const [reportType, setReportType] = useState<
    "missing" | "stolen" | "active" | "inactive"
  >("missing");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await deviceApi.AdminGetAll();
      if (response.status === "success") {
        console.log(`status devices ${JSON.stringify(response.data)}`);
        setDevices(response.data);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice || !reportType || !description || !location) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const reportData: ReportDeviceRequest = {
      deviceId: selectedDevice,
      reportType,
      description,
      location,
    };

    try {
      const response = await deviceApi.AdminUpdateStatus(reportData);

      if (response.status === "success") {
        // Update device status locally
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === selectedDevice
              ? { ...device, status: reportType as DeviceStatus }
              : device
          )
        );

        setSuccess("Device has been reported successfully");
        toast.success("Device has been reported successfully");

        // Reset form
        setSelectedDevice("");
        setDescription("");
        setLocation("");
      } else {
        throw new Error(response.message || "Failed to report device");
      }
    } catch (error: any) {
      setError(error.message || "Failed to report device. Please try again.");
      toast.error(
        error.message || "Failed to report device. Please try again."
      );
    } finally {
      setIsSubmitting(false);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <AlertTriangle className="h-8 w-8 text-error" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Report a Device
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="device"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Select Device
              </label>
              <select
                id="device"
                value={selectedDevice}
                onChange={(e) => {
                  setSelectedDevice(e.target.value);
                  const device = devices.find((d) => d.id === e.target.value);
                  setSelectedDeviceDetails(device || null);
                }}
                className="block w-full px-4 py-2.5 text-base rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white
                appearance-none cursor-pointer transition-colors duration-200
                bg-no-repeat bg-right pr-8"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundSize: "1.5em 1.5em",
                }}
                required
              >
                <option value="" className="py-2 px-3">
                  Choose a device
                </option>
                {devices.map((device) => (
                  <option
                    key={device.id}
                    value={device.id}
                    className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150"
                  >
                    {device.name} - {device.status}
                  </option>
                ))}
              </select>
            </div>

            {selectedDeviceDetails && (
              <div className="mt-6 mb-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Device Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Name:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {selectedDeviceDetails.name}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Serial Number:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {selectedDeviceDetails.SN}
                      </span>
                    </div>

                    {selectedDeviceDetails.IMEI1 && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          IMEI1:
                        </span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {selectedDeviceDetails.IMEI1}
                        </span>
                      </div>
                    )}

                    {selectedDeviceDetails.IMEI2 && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          IMEI2:
                        </span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {selectedDeviceDetails.IMEI2}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Type:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {selectedDeviceDetails.Type ||
                          selectedDeviceDetails.type ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status:
                      </span>
                      <span
                        className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                          selectedDeviceDetails.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : selectedDeviceDetails.status === "missing"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : selectedDeviceDetails.status === "stolen"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {selectedDeviceDetails.status}
                      </span>
                    </div>

                    {selectedDeviceDetails.user && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          User:
                        </span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {selectedDeviceDetails.user.username}
                        </span>
                      </div>
                    )}

                    {selectedDeviceDetails.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Added on:
                        </span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {new Date(
                            selectedDeviceDetails.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="missing"
                    checked={reportType === "missing"}
                    onChange={(e) =>
                      setReportType(e.target.value as "missing" | "stolen")
                    }
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Missing
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="stolen"
                    checked={reportType === "stolen"}
                    onChange={(e) =>
                      setReportType(e.target.value as "missing" | "stolen")
                    }
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Stolen
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="inactive"
                    checked={reportType === "inactive"}
                    onChange={(e) =>
                      setReportType(e.target.value as "inactive")
                    }
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Inactive
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="active"
                    checked={reportType === "active"}
                    onChange={(e) => setReportType(e.target.value as "active")}
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Active
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Last Known Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
                placeholder="Enter the last known location"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="input-field"
                placeholder="Provide details about when and how the device was lost/stolen"
                required
              />
            </div>

            {error && (
              <div className="bg-error bg-opacity-10 text-error p-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Reporting...</span>
                  </>
                ) : (
                  "Report Device"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportDevicePage;
