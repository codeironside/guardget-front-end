import React, { useState } from "react";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";

const RegisterDevicePage = () => {
  const navigate = useNavigate();
  const [deviceType, setDeviceType] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    imei1: "",
    imei2: "",
    type: "",
    purchaseDate: "",
    notes: "",
    status: "active" as "active" | "reported" | "missing" | "stolen",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Device name is required";
    if (!formData.serialNumber)
      newErrors.serialNumber = "Serial number is required";
    if (!formData.status) newErrors.status = "Status is required";

    if (deviceType === "smartphone") {
      if (!formData.imei1)
        newErrors.imei1 = "IMEI 1 is required for mobile devices";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const devicePayload = {
        name: formData.name,
        serialNumber: formData.serialNumber,
        type: deviceType,
        imei: formData.imei1,
        status: formData.status,
        ...(deviceType === "smartphone" && { imei2: formData.imei2 }),
        purchaseDate: formData.purchaseDate,
        notes: formData.notes,
      };

      const response = await deviceApi.create(devicePayload);

      if (response.status === "success") {
        toast.success("Device registered successfully!");
        navigate("/dashboard/my-devices");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register device");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary dark:text-primary-light" />
          <h1 className="text-3xl font-bold text-secondary dark:text-white font-heading">
            Register New Device
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Device Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-secondary dark:text-gray-300"
              >
                Device Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name ? "border-error" : ""
                }`}
                placeholder="Enter device name"
              />
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Device Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-secondary dark:text-gray-300"
              >
                Device Type
              </label>
              <select
                id="type"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.type ? "border-error" : ""
                }`}
              >
                <option value="">Select device type</option>
                <option value="smartphone">Smartphone</option>
                <option value="tablet">Tablet</option>
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Serial Number */}
            <div>
              <label
                htmlFor="serialNumber"
                className="block text-sm font-medium text-secondary dark:text-gray-300"
              >
                Serial Number (SN)
              </label>
              <input
                type="text"
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.serialNumber ? "border-error" : ""
                }`}
                placeholder="Enter serial number"
              />
              {errors.serialNumber && (
                <p className="text-error text-sm mt-1">{errors.serialNumber}</p>
              )}
            </div>

            {/* Conditional IMEI Fields */}
            {deviceType === "smartphone" && (
              <>
                <div>
                  <label
                    htmlFor="imei1"
                    className="block text-sm font-medium text-secondary dark:text-gray-300"
                  >
                    IMEI 1 (Required)
                  </label>
                  <input
                    type="text"
                    id="imei1"
                    value={formData.imei1}
                    onChange={(e) =>
                      setFormData({ ...formData, imei1: e.target.value })
                    }
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.imei1 ? "border-error" : ""
                    }`}
                    placeholder="Enter IMEI 1"
                  />
                  {errors.imei1 && (
                    <p className="text-error text-sm mt-1">{errors.imei1}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="imei2"
                    className="block text-sm font-medium text-secondary dark:text-gray-300"
                  >
                    IMEI 2 (Optional)
                  </label>
                  <input
                    type="text"
                    id="imei2"
                    value={formData.imei2}
                    onChange={(e) =>
                      setFormData({ ...formData, imei2: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter IMEI 2"
                  />
                </div>
              </>
            )}

            {/* Status Field */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-secondary dark:text-gray-300"
              >
                Device Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as typeof formData.status,
                  })
                }
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.status ? "border-error" : ""
                }`}
              >
                <option value="active">Active</option>
                <option value="reported">Reported</option>
                <option value="missing">Missing</option>
                <option value="stolen">Stolen</option>
              </select>
              {errors.status && (
                <p className="text-error text-sm mt-1">{errors.status}</p>
              )}
            </div>

            {/* Purchase Date */}
            <div>
              <label
                htmlFor="purchaseDate"
                className="block text-sm font-medium text-secondary dark:text-gray-300"
              >
                Purchase Date
              </label>
              <input
                type="date"
                id="purchaseDate"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseDate: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-secondary dark:text-gray-300"
              >
                Additional Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter any additional information about the device"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Register Device
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterDevicePage;
