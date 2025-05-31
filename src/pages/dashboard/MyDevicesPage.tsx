import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Laptop,
  AlertCircle,
  Check,
  MoreVertical,
  AlertTriangle,
  PauseCircle,
  ArrowRightCircle,
  Shield,
  Tablet,
  Search,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";

type Device = {
  id: string;
  name: string;
  IMIE1?: string;
  IMEI2?: string;
  serialNumber: string;
  Type: "smartphone" | "laptop" | "tablet";
  status: "active" | "inactive" | "missing" | "stolen" | "transfer_pending";
  purchaseDate: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
};

const MyDevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "inactive" | "missing" | "stolen" | "transfer_pending"
  >("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
      setLoading(true);
      const response = await deviceApi.getAll();
      if (response.status === "success") {
        setDevices(response.data);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error("Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices.filter((device) => {
    const matchesTab = activeTab === "all" || device.status === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.IMIE1 &&
        device.IMIE1.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
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

    toast.success("Device deletion scheduled");
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
      case "inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 bg-opacity-10 text-gray-600 dark:text-gray-400">
            <PauseCircle className="h-3 w-3 mr-1" />
            Inactive
          </span>
        );
      case "missing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning bg-opacity-10 text-warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Missing
          </span>
        );
      case "stolen":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error bg-opacity-10 text-error">
            <AlertCircle className="h-3 w-3 mr-1" />
            Stolen
          </span>
        );
      case "transfer_pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary">
            <ArrowRightCircle className="h-3 w-3 mr-1" />
            Transfer Pending
          </span>
        );
      default:
        return null;
    }
  };

  const getDeviceIcon = (type: Device["Type"]) => {
    const iconClasses = "h-6 w-6 text-primary";

    switch (type) {
      case "smartphone":
        return <Smartphone className={iconClasses} />;
      case "laptop":
        return <Laptop className={iconClasses} />;
      case "tablet":
        return <Tablet className={iconClasses} />;
      default:
        return <Smartphone className={iconClasses} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusCounts = {
    all: devices.length,
    active: devices.filter((d) => d.status === "active").length,
    inactive: devices.filter((d) => d.status === "inactive").length,
    missing: devices.filter((d) => d.status === "missing").length,
    stolen: devices.filter((d) => d.status === "stolen").length,
    transfer_pending: devices.filter((d) => d.status === "transfer_pending")
      .length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-error bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-error" />
        </div>
        <h3 className="text-lg font-medium text-secondary dark:text-white mb-2">
          Failed to load devices
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <button
          className="btn btn-primary inline-flex items-center"
          onClick={fetchDevices}
        >
          <Shield className="h-5 w-5 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-secondary dark:text-white mb-2">
              Device Registry
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Secure monitoring and management of your registered devices.
              Currently {statusCounts.active} of 5 devices active.
            </p>
          </div>
          {/* <button className="btn btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Register New Device
          </button> */}
        </div>
      </div>

      {/* Search and Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Search Bar */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by device name, serial, or IMEI..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-success bg-opacity-10 p-2 rounded-lg mr-3">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Devices
              </p>
              <p className="text-xl font-semibold text-secondary dark:text-white">
                {statusCounts.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-warning bg-opacity-10 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                At Risk
              </p>
              <p className="text-xl font-semibold text-secondary dark:text-white">
                {statusCounts.missing + statusCounts.stolen}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            {(
              Object.keys(statusCounts) as Array<keyof typeof statusCounts>
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-primary"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace("_", " ")}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                  {statusCounts[tab]}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Device List */}
      <div className="space-y-4">
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Device Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                    {getDeviceIcon(device.Type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-secondary dark:text-white text-lg">
                          {device.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {device.Type} • Registered by {device.user.username}
                        </p>
                      </div>
                      {getStatusBadge(device.status)}
                    </div>

                    {/* Device Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      {/* Serial Number */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Serial Number
                        </p>
                        <p className="font-mono text-sm text-secondary dark:text-white">
                          {device.serialNumber}
                        </p>
                      </div>

                      {/* IMEI 1 */}
                      {device.IMIE1 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            IMEI 1
                          </p>
                          <p className="font-mono text-sm text-secondary dark:text-white">
                            {device.IMIE1}
                          </p>
                        </div>
                      )}

                      {/* IMEI 2 */}
                      {device.IMEI2 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            IMEI 2
                          </p>
                          <p className="font-mono text-sm text-secondary dark:text-white">
                            {device.IMEI2}
                          </p>
                        </div>
                      )}

                      {/* Purchase Date */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Purchase Date
                        </p>
                        <p className="text-sm text-secondary dark:text-white">
                          {formatDate(device.purchaseDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Added
                    </p>
                    <p className="text-sm text-secondary dark:text-white">
                      {formatDate(device.createdAt)}
                    </p>
                  </div>

                  {/* <button
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors"
                    onClick={() => handleDeleteClick(device.id)}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button> */}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDevices.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-primary bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-secondary dark:text-white mb-2">
            No devices found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Secure your devices by registering them in our system"}
          </p>
          <button className="btn btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Register Your First Device
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start mb-6">
              <div className="bg-error bg-opacity-10 p-3 rounded-lg mr-4">
                <AlertCircle className="h-6 w-6 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary dark:text-white">
                  Remove Device
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                  This action cannot be undone. The device will be removed from
                  your account after 48 hours.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="deleteReason"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Reason for removal *
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
              <button onClick={closeDeleteModal} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn bg-error text-white hover:bg-error-dark disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!deleteReason}
              >
                Remove Device
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyDevicesPage;
