import React, { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "../../components/LoadingSpinner";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";

interface Device {
  id: string;
  name: string;
  model: string;
  type: "phone" | "laptop";
  status: "active" | "reported" | "missing" | "stolen";
  SN: string;
  IMEI1?: string;
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
  const [reportType, setReportType] = useState<"missing" | "stolen">("missing");
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
      const response = await deviceApi.getAll();
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
      const response = await deviceApi.updateStatus(reportData);

      if (response.status === "success") {
        // Update device status locally
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === selectedDevice
              ? { ...device, status: reportType }
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
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Choose a device</option>
                {devices
                  .filter((d) => d.status === "active")
                  .map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name} (
                      {device.type === "phone"
                        ? `IMEI: ${device.IMEI1}`
                        : `S/N: ${device.SN}`}
                      )
                    </option>
                  ))}
              </select>
            </div>

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
