import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  Smartphone,
  Laptop,
  Cpu,
  MapPin,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../../components/LoadingSpinner";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";

enum DeviceStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MISSING = "missing",
  STOLEN = "stolen",
  TRANSFER_PENDING = "transfer_pending",
}

interface User {
  _id: string;
  username: string;
  phoneNumber?: string;
  email: string;
  imageurl?: string;
  subscriptionStatus: string;
}

interface Device {
  _id: string;
  name: string;
  IMIE1?: string;
  IMEI2?: string;
  serialNumber?: string;
  Type: string;
  status: DeviceStatus;
  createdAt: string;
  user: User;
}

interface ReportDeviceRequest {
  deviceId: string;
  reportType: "missing" | "stolen" | "active" | "inactive";
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
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await deviceApi.AdminGetAll();
      if (response.status === "success") {
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
            device._id === selectedDevice
              ? { ...device, status: reportType as DeviceStatus }
              : device
          )
        );

        setSuccess("Device status has been updated successfully");
        toast.success("Device status has been updated successfully");

        // Reset form
        setSelectedDevice("");
        setSelectedDeviceDetails(null);
        setDescription("");
        setLocation("");
        setReportType("missing");
      } else {
        throw new Error(response.message || "Failed to update device status");
      }
    } catch (error: any) {
      setError(
        error.message || "Failed to update device status. Please try again."
      );
      toast.error(
        error.message || "Failed to update device status. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    const iconClass = "h-5 w-5 text-primary";
    switch (type?.toLowerCase()) {
      case "smartphone":
      case "phone":
        return <Smartphone className={iconClass} />;
      case "laptop":
      case "computer":
        return <Laptop className={iconClass} />;
      default:
        return <Cpu className={iconClass} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "active":
        return (
          <span
            className={`${baseClasses} bg-success bg-opacity-10 text-success`}
          >
            Active
          </span>
        );
      case "inactive":
        return (
          <span
            className={`${baseClasses} bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300`}
          >
            Inactive
          </span>
        );
      case "missing":
        return (
          <span
            className={`${baseClasses} bg-warning bg-opacity-10 text-warning`}
          >
            Missing
          </span>
        );
      case "stolen":
        return (
          <span className={`${baseClasses} bg-error bg-opacity-10 text-error`}>
            Stolen
          </span>
        );
      case "transfer_pending":
        return (
          <span
            className={`${baseClasses} bg-primary bg-opacity-10 text-primary`}
          >
            Transfer Pending
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-600`}>
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-warning bg-opacity-10 rounded-full mb-4"
            >
              <AlertTriangle className="h-8 w-8 text-warning" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold text-secondary dark:text-white mb-2">
              Device Status Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Update device status, report missing or stolen devices, and manage
              device information in the system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="space-y-8">
                  {/* Device Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select Device
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      >
                        <span className="flex items-center">
                          {selectedDeviceDetails ? (
                            <>
                              {getDeviceIcon(selectedDeviceDetails.Type)}
                              <span className="ml-3 text-secondary dark:text-white font-medium">
                                {selectedDeviceDetails.name}
                              </span>
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                ({selectedDeviceDetails.Type})
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">
                              Choose a device
                            </span>
                          )}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform ${
                            showDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                          >
                            {devices.length === 0 ? (
                              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                No devices available
                              </div>
                            ) : (
                              devices.map((device) => (
                                <button
                                  key={device._id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDevice(device._id);
                                    setSelectedDeviceDetails(device);
                                    setShowDropdown(false);
                                  }}
                                  className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                >
                                  {getDeviceIcon(device.Type)}
                                  <div className="ml-3 flex-1 text-left">
                                    <div className="font-medium text-secondary dark:text-white">
                                      {device.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3">
                                      <span>{device.Type}</span>
                                      {getStatusBadge(device.status)}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      @{device.user.username}
                                    </div>
                                  </div>
                                </button>
                              ))
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Update Status To
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "active", label: "Active", color: "success" },
                        { value: "inactive", label: "Inactive", color: "gray" },
                        {
                          value: "missing",
                          label: "Missing",
                          color: "warning",
                        },
                        { value: "stolen", label: "Stolen", color: "error" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            reportType === option.value
                              ? `border-${
                                  option.color === "gray"
                                    ? "gray-300"
                                    : option.color
                                } bg-${
                                  option.color === "gray"
                                    ? "gray"
                                    : option.color
                                } bg-opacity-5`
                              : "border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                          }`}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            checked={reportType === option.value}
                            onChange={(e) =>
                              setReportType(e.target.value as any)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              reportType === option.value
                                ? `border-${
                                    option.color === "gray"
                                      ? "gray-400"
                                      : option.color
                                  } bg-${
                                    option.color === "gray"
                                      ? "gray-400"
                                      : option.color
                                  }`
                                : "border-gray-300"
                            }`}
                          >
                            {reportType === option.value && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <span className="font-medium text-secondary dark:text-white">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Input */}
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Last Known Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input-field pl-10"
                        placeholder="Enter the last known location"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="input-field pl-10"
                        placeholder="Provide details about the device status change..."
                        required
                      />
                    </div>
                  </div>

                  {/* Error/Success Messages */}
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

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-success bg-opacity-10 text-success p-4 rounded-lg flex items-start"
                      >
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{success}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !selectedDevice}
                      className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Updating...</span>
                        </>
                      ) : (
                        "Update Device Status"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Device Details Sidebar */}
            <div className="space-y-6">
              {selectedDeviceDetails && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h3 className="text-lg font-semibold text-secondary dark:text-white mb-4">
                    Device Details
                  </h3>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-lg">
                      {getDeviceIcon(selectedDeviceDetails.Type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary dark:text-white">
                        {selectedDeviceDetails.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedDeviceDetails.Type}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    {selectedDeviceDetails.serialNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Serial:
                        </span>
                        <span className="font-mono text-secondary dark:text-white">
                          {selectedDeviceDetails.serialNumber}
                        </span>
                      </div>
                    )}

                    {selectedDeviceDetails.IMIE1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          IMEI:
                        </span>
                        <span className="font-mono text-secondary dark:text-white">
                          {selectedDeviceDetails.IMIE1}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Status:
                      </span>
                      {getStatusBadge(selectedDeviceDetails.status)}
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Added:
                      </span>
                      <span className="text-secondary dark:text-white">
                        {formatDate(selectedDeviceDetails.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Owner Information
                    </h4>
                    <div className="flex items-center gap-3">
                      {selectedDeviceDetails.user.imageurl ? (
                        <img
                          src={selectedDeviceDetails.user.imageurl}
                          alt={selectedDeviceDetails.user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-secondary dark:text-white">
                          {selectedDeviceDetails.user.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedDeviceDetails.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-secondary dark:text-white mb-4">
                  System Overview
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total Devices:
                    </span>
                    <span className="font-medium text-secondary dark:text-white">
                      {devices.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Active:
                    </span>
                    <span className="font-medium text-success">
                      {devices.filter((d) => d.status === "active").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Missing/Stolen:
                    </span>
                    <span className="font-medium text-error">
                      {
                        devices.filter(
                          (d) => d.status === "missing" || d.status === "stolen"
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportDevicePage;
