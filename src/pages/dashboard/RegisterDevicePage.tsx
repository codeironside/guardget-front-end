import React, { useState } from "react";
import {
  Shield,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  HardDrive,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deviceApi } from "../../api/devices";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

interface ValidationResult {
  isValid: boolean;
  message: string;
}

interface FormValidation {
  name: ValidationResult;
  serialNumber: ValidationResult;
  type: ValidationResult;
  imei1: ValidationResult;
  imei2: ValidationResult;
  status: ValidationResult;
}

const RegisterDevicePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const [validation, setValidation] = useState<FormValidation>({
    name: { isValid: false, message: "" },
    serialNumber: { isValid: false, message: "" },
    type: { isValid: false, message: "" },
    imei1: { isValid: false, message: "" },
    imei2: { isValid: false, message: "" },
    status: { isValid: true, message: "Valid status" }, // Default to active
  });

  // Validation patterns
  const patterns = {
    name: /^[a-zA-Z0-9\s-_]{2,50}$/,
    serialNumber: /^[a-zA-Z0-9-_]{3,30}$/,
    imei: /^[0-9]{15}$/,
  };

  // IMEI Luhn algorithm validation
  const validateIMEI = (imei: string): boolean => {
    if (!patterns.imei.test(imei)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = imei.length - 1; i >= 0; i--) {
      let digit = parseInt(imei[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit = digit
            .toString()
            .split("")
            .reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateField = (name: string, value: string): ValidationResult => {
    switch (name) {
      case "name":
        if (!value)
          return { isValid: false, message: "Device name is required" };
        if (!patterns.name.test(value)) {
          return {
            isValid: false,
            message:
              "Name must be 2-50 characters, letters, numbers, spaces, hyphens, underscores only",
          };
        }
        return { isValid: true, message: "Valid device name" };

      case "serialNumber":
        if (!value)
          return { isValid: false, message: "Serial number is required" };
        if (!patterns.serialNumber.test(value)) {
          return {
            isValid: false,
            message:
              "Serial number must be 3-30 characters, alphanumeric with hyphens/underscores",
          };
        }
        return { isValid: true, message: "Valid serial number" };

      case "type":
        if (!value)
          return { isValid: false, message: "Device type is required" };
        return { isValid: true, message: "Valid device type" };

      case "imei1":
        if (formData.type === "smartphone" || formData.type === "tablet") {
          if (!value)
            return {
              isValid: false,
              message: "IMEI 1 is required for mobile devices",
            };
          if (!patterns.imei.test(value)) {
            return {
              isValid: false,
              message: "IMEI must be exactly 15 digits",
            };
          }
          if (!validateIMEI(value)) {
            return {
              isValid: false,
              message: "Invalid IMEI - please check your device settings",
            };
          }
          return { isValid: true, message: "Valid IMEI" };
        }
        return { isValid: true, message: "" };

      case "imei2":
        if (!value) return { isValid: true, message: "" }; // Optional field
        if (!patterns.imei.test(value)) {
          return { isValid: false, message: "IMEI must be exactly 15 digits" };
        }
        if (!validateIMEI(value)) {
          return {
            isValid: false,
            message: "Invalid IMEI - please check your device settings",
          };
        }
        return { isValid: true, message: "Valid IMEI" };

      case "status":
        return { isValid: true, message: "Valid status" };

      default:
        return { isValid: true, message: "" };
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;

    // For IMEI fields, only allow numbers
    if ((name === "imei1" || name === "imei2") && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change
    const fieldValidation = validateField(name, value);
    setValidation((prev) => ({
      ...prev,
      [name as keyof FormValidation]: fieldValidation,
    }));

    // Clear errors
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getValidationIcon = (field: keyof FormValidation) => {
    const fieldValidation = validation[field];
    const fieldValue = formData[field as keyof typeof formData];

    if (!fieldValue && field !== "status") return null;

    if (fieldValidation.isValid) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getInputClasses = (
    field: keyof FormValidation,
    hasIcon: boolean = false
  ) => {
    const baseClasses = `block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 ${
      hasIcon ? "pr-12" : ""
    }`;

    const fieldValidation = validation[field];
    const fieldValue = formData[field as keyof typeof formData];

    if (!fieldValue && field !== "status") {
      return `${baseClasses} border-gray-300 dark:border-gray-600 focus:ring-primary hover:border-gray-400`;
    }

    if (fieldValidation.isValid) {
      return `${baseClasses} border-green-300 dark:border-green-600 focus:ring-green-500 bg-green-50 dark:bg-green-900/20`;
    } else {
      return `${baseClasses} border-red-300 dark:border-red-600 focus:ring-red-500 bg-red-50 dark:bg-red-900/20`;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "smartphone":
        return <Smartphone className="h-5 w-5" />;
      case "tablet":
        return <Tablet className="h-5 w-5" />;
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      case "desktop":
        return <Monitor className="h-5 w-5" />;
      default:
        return <HardDrive className="h-5 w-5" />;
    }
  };

  const isFormValid = (): boolean => {
    const requiredFields = ["name", "serialNumber", "type"];
    const mobileDevices = ["smartphone", "tablet"];

    // Check required fields
    for (const field of requiredFields) {
      if (!validation[field as keyof FormValidation].isValid) return false;
    }

    // Check IMEI for mobile devices
    if (mobileDevices.includes(formData.type) && !validation.imei1.isValid) {
      return false;
    }

    // Check IMEI2 if provided
    if (formData.imei2 && !validation.imei2.isValid) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrors({});

    if (!isFormValid()) {
      setErrors({
        general: "Please fix all validation errors before submitting",
      });
      return;
    }

    setIsLoading(true);

    try {
      const devicePayload = {
        name: formData.name,
        serialNumber: formData.serialNumber,
        type: formData.type,
        IMEI1: formData.imei1 || null, // Send as IMEI1 to backend
        IMEI2: formData.imei2 || null, // Send as IMEI2 to backend
        status: formData.status,
        purchaseDate: formData.purchaseDate || null,
        notes: formData.notes || null,
      };

      const response = await deviceApi.create(devicePayload);

      if (response.status === "success") {
        toast.success("Device registered successfully!");
        navigate("/dashboard/my-devices");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register device");
      setErrors({ general: error.message || "Failed to register device" });
    } finally {
      setIsLoading(false);
    }
  };

  const deviceTypes = [
    {
      value: "smartphone",
      label: "Smartphone",
      icon: Smartphone,
      requiresIMEI: true,
    },
    { value: "tablet", label: "Tablet", icon: Tablet, requiresIMEI: true },
    { value: "laptop", label: "Laptop", icon: Laptop, requiresIMEI: false },
    { value: "desktop", label: "Desktop", icon: Monitor, requiresIMEI: false },
    { value: "other", label: "Other", icon: HardDrive, requiresIMEI: false },
  ];

  const statusOptions = [
    {
      value: "active",
      label: "Active",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      value: "reported",
      label: "Reported",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      value: "missing",
      label: "Missing",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      value: "stolen",
      label: "Stolen",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-gray-50 to-primary/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/my-devices")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 mb-4 group"
            type="button"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to My Devices
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Register New Device
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Add a device to your protection network
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-400 dark:text-red-500 mr-2" />
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {errors.general}
                      </p>
                    </div>
                  </div>
                )}

                {/* Device Basic Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Shield className="h-5 w-5 text-primary mr-2" />
                      Device Information
                    </h3>
                  </div>

                  {/* Device Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Device Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={getInputClasses("name", true)}
                        placeholder="e.g., iPhone 15 Pro, MacBook Air M2"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {getValidationIcon("name")}
                      </div>
                    </div>
                    {formData.name && (
                      <p
                        className={`mt-2 text-xs ${
                          validation.name.isValid
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {validation.name.message}
                      </p>
                    )}
                  </div>

                  {/* Device Type */}
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Device Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {deviceTypes.map((deviceType) => {
                        const Icon = deviceType.icon;
                        const isSelected = formData.type === deviceType.value;
                        return (
                          <button
                            key={deviceType.value}
                            type="button"
                            onClick={() =>
                              handleChange({
                                target: {
                                  name: "type",
                                  value: deviceType.value,
                                },
                              } as any)
                            }
                            className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                              isSelected
                                ? "border-primary bg-primary/10 dark:bg-primary/20 text-primary"
                                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                            <span className="text-sm font-medium">
                              {deviceType.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {formData.type && (
                      <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                        {validation.type.message}
                      </p>
                    )}
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label
                      htmlFor="serialNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Serial Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="serialNumber"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        className={getInputClasses("serialNumber", true)}
                        placeholder="Enter device serial number"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {getValidationIcon("serialNumber")}
                      </div>
                    </div>
                    {formData.serialNumber && (
                      <p
                        className={`mt-2 text-xs ${
                          validation.serialNumber.isValid
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {validation.serialNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* IMEI Section for Mobile Devices */}
                {(formData.type === "smartphone" ||
                  formData.type === "tablet") && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Smartphone className="h-5 w-5 text-primary mr-2" />
                        IMEI Information
                      </h3>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          <p className="font-medium mb-1">
                            How to find your IMEI:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Dial *#06# on your device</li>
                            <li>Go to Settings → About Phone/Device → IMEI</li>
                            <li>
                              Check the device's SIM tray or battery compartment
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* IMEI 1 */}
                      <div>
                        <label
                          htmlFor="imei1"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          IMEI 1 (Primary) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="imei1"
                            name="imei1"
                            value={formData.imei1}
                            onChange={handleChange}
                            className={getInputClasses("imei1", true)}
                            placeholder="Enter 15-digit IMEI"
                            maxLength={15}
                            required
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {getValidationIcon("imei1")}
                          </div>
                        </div>
                        {formData.imei1 && (
                          <p
                            className={`mt-2 text-xs ${
                              validation.imei1.isValid
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {validation.imei1.message}
                          </p>
                        )}
                      </div>

                      {/* IMEI 2 */}
                      <div>
                        <label
                          htmlFor="imei2"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          IMEI 2 (Secondary)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="imei2"
                            name="imei2"
                            value={formData.imei2}
                            onChange={handleChange}
                            className={getInputClasses("imei2", true)}
                            placeholder="Enter 15-digit IMEI (optional)"
                            maxLength={15}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {getValidationIcon("imei2")}
                          </div>
                        </div>
                        {formData.imei2 && (
                          <p
                            className={`mt-2 text-xs ${
                              validation.imei2.isValid
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {validation.imei2.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FileText className="h-5 w-5 text-primary mr-2" />
                      Additional Information
                    </h3>
                  </div>

                  {/* Device Status */}
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Device Status
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {statusOptions.map((statusOption) => {
                        const isSelected =
                          formData.status === statusOption.value;
                        return (
                          <button
                            key={statusOption.value}
                            type="button"
                            onClick={() =>
                              handleChange({
                                target: {
                                  name: "status",
                                  value: statusOption.value,
                                },
                              } as any)
                            }
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                              isSelected
                                ? `border-current ${statusOption.bgColor} ${statusOption.color}`
                                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {statusOption.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Purchase Date */}
                  <div>
                    <label
                      htmlFor="purchaseDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Purchase Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="purchaseDate"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white pl-12"
                      />
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400"
                      placeholder="Any additional information about your device (model, color, distinguishing features, etc.)"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={isLoading || !isFormValid()}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Registering Device...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        Register Device
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Device Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Device Preview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                    {getDeviceIcon(formData.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.name || "Device Name"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.type
                        ? deviceTypes.find((t) => t.value === formData.type)
                            ?.label
                        : "Device Type"}
                    </p>
                  </div>
                </div>

                {formData.serialNumber && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Serial:{" "}
                    </span>
                    <span className="text-gray-900 dark:text-white font-mono">
                      {formData.serialNumber}
                    </span>
                  </div>
                )}

                {formData.imei1 && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      IMEI 1:{" "}
                    </span>
                    <span className="text-gray-900 dark:text-white font-mono">
                      {formData.imei1}
                    </span>
                  </div>
                )}

                {formData.imei2 && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      IMEI 2:{" "}
                    </span>
                    <span className="text-gray-900 dark:text-white font-mono">
                      {formData.imei2}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-2xl p-6 border border-primary/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 text-primary mr-2" />
                Security Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Keep your device information up to date
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Enable device tracking features
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Report status changes immediately
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Store IMEI numbers safely
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDevicePage;
