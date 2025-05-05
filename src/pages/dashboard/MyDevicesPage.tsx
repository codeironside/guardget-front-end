import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Laptop,
  AlertCircle,
  Check,
  X,
  MoreVertical,
  Edit,
  Trash,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";
type Device = {
  id: string;
  name: string;
  model: string;
  Type: "phone" | "laptop";
  status: "active" | "reported" | "missing";
  IMEI1?: string;
  SN: string;
  createdAt: string;
};

const MyDevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "reported" | "missing">(
    "all"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    deviceId: string | null;
  }>({
    isOpen: false,
    deviceId: null,
  });
  const [deleteReason, setDeleteReason] = useState("");

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

  const filteredDevices = devices.filter((device) => {
    if (activeTab === "all") return true;
    return device.status === activeTab;
  });

  const handleDeleteClick = (deviceId: string) => {
    setDeleteModal({
      isOpen: true,
      deviceId,
    });
  };

  const confirmDelete = () => {
    if (!deleteModal.deviceId || !deleteReason) return;

    // In a real app, this would be an API call
    setDevices(devices.filter((device) => device.id !== deleteModal.deviceId));
    setDeleteModal({ isOpen: false, deviceId: null });
    setDeleteReason("");

    // Show a toast or notification
    alert(`Device will be deleted in 48 hours. Reason: ${deleteReason}`);
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, deviceId: null });
    setDeleteReason("");
  };

  const getStatusBadge = (status: Device["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success bg-opacity-10 text-success">
            <Check className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case "reported":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error bg-opacity-10 text-error">
            <AlertCircle className="h-3 w-3 mr-1" />
            Reported
          </span>
        );
      case "missing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning bg-opacity-10 text-warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Missing
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-white mb-2">
          My Devices
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage all your registered devices. You can have up to 5 devices
          registered.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "all"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              All Devices
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                {devices.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("reported")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "reported"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              Reported
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                {devices.filter((d) => d.status === "reported").length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("missing")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "missing"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              Missing
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                {devices.filter((d) => d.status === "missing").length}
              </span>
            </button>
          </nav>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No devices found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDevices.map((device) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-start border border-gray-200 dark:border-gray-600"
                >
                  <div className="bg-primary bg-opacity-10 p-3 rounded-lg mr-4">
                    {device.type === "phone" ? (
                      <Smartphone className="h-6 w-6 text-primary" />
                    ) : (
                      <Laptop className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-secondary dark:text-white">
                          {device.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Model: {device.Type}
                        </p>
                      </div>
                      <div className="relative">
                        <div className="dropdown">
                          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </button>
                          {/* Dropdown menu would go here */}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      {device.IMEI1 && (
                        <p className="text-gray-600 dark:text-gray-300">
                          IMEI: {device.IMEI1}
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-300">
                        S/N: {device.SN}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Added: {device.createdAt}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      {getStatusBadge(device.status)}
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-500 hover:text-primary transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-500 hover:text-error transition-colors"
                          onClick={() => handleDeleteClick(device.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start mb-4">
              <div className="bg-error bg-opacity-10 p-2 rounded-full mr-4">
                <AlertCircle className="h-6 w-6 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary dark:text-white">
                  Delete Device
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  This action cannot be undone. The device will be removed from
                  your account after 48 hours.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="deleteReason"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Reason for deleting
              </label>
              <select
                id="deleteReason"
                className="input-field"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                <option value="sold">Sold the device</option>
                <option value="lost">Lost the device</option>
                <option value="stolen">Device was stolen</option>
                <option value="duplicate">Duplicate entry</option>
                <option value="other">Other reason</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-error text-white rounded-md text-sm font-medium hover:bg-error-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!deleteReason}
              >
                Delete Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDevicesPage;
