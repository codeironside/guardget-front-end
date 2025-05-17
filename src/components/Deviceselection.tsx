
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Laptop, ChevronDown } from "lucide-react";

interface DeviceProps {
  id: string;
  name: string;
  model?: string;
  Type?: string;
  type?: string;
  serialNumber?: string;
  SN?: string;
  imei?: string;
  IMEI?: string;
  IMEI2?: string;
  status: "active" | "reported" | "missing" | "stolen";
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

interface DeviceSelectionProps {
  devices: DeviceProps[];
  selectedDevice: string;
  setSelectedDevice: (deviceId: string) => void;
  disabled?: boolean;
}

const DeviceSelection: React.FC<DeviceSelectionProps> = ({
  devices,
  selectedDevice,
  setSelectedDevice,
  disabled = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setDropdownOpen(false);
  };

  // Get device icon based on type
  const getDeviceIcon = (device: DeviceProps) => {
    const type = device.Type?.toLowerCase() || device.type?.toLowerCase() || "";
    return type.includes("phone") || type.includes("smartphone") ? (
      <Smartphone className="h-5 w-5 text-primary" />
    ) : (
      <Laptop className="h-5 w-5 text-primary" />
    );
  };

  // Get device identifier (IMEI or Serial Number)
  const getDeviceIdentifier = (device: DeviceProps) => {
    const type = device.Type?.toLowerCase() || device.type?.toLowerCase() || "";
    if (type.includes("phone") || type.includes("smartphone")) {
      return `IMEI: ${device.IMEI || device.IMEI2 || device.imei || "N/A"}`;
    } else {
      return `S/N: ${device.SN || device.serialNumber || "N/A"}`;
    }
  };

  // Get the selected device details
  const getSelectedDevice = () => {
    return devices.find((d) => d.id === selectedDevice);
  };

  return (
    <div>
      <label
        htmlFor="device"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Select Device
      </label>

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
          className={`flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ${
            !disabled
              ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
              : "opacity-75"
          } transition duration-150`}
        >
          <div className="flex items-center">
            {selectedDevice && getSelectedDevice() ? (
              <>
                {getDeviceIcon(getSelectedDevice()!)}
                <span className="ml-2">
                  {getSelectedDevice()?.name || "Choose a device"}
                </span>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                Choose a device
              </span>
            )}
          </div>
          {!disabled && (
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
            />
          )}
        </div>

        <AnimatePresence>
          {dropdownOpen && !disabled && devices && devices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 text-base overflow-auto focus:outline-none max-h-60"
            >
              {devices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => handleSelectDevice(device.id)}
                  className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ${
                    selectedDevice === device.id
                      ? "bg-gray-100 dark:bg-gray-600"
                      : ""
                  }`}
                >
                  <div className="mr-3">{getDeviceIcon(device)}</div>
                  <div>
                    <div
                      className={`font-medium ${
                        selectedDevice === device.id
                          ? "text-primary"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {device.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getDeviceIdentifier(device)}
                    </div>
                    <div className="text-xs mt-0.5">
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          device.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : device.status === "missing"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : device.status === "stolen"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}
                      >
                        {device.status.charAt(0).toUpperCase() +
                          device.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected device details */}
      {selectedDevice && getSelectedDevice() && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md mt-3"
        >
          {(() => {
            const device = getSelectedDevice();
            if (!device) return null;

            return (
              <div className="flex items-start">
                <div className="mr-3 mt-1">{getDeviceIcon(device)}</div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {device.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Model: {device.model || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getDeviceIdentifier(device)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        device.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : device.status === "missing"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : device.status === "stolen"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      Status:{" "}
                      {device.status.charAt(0).toUpperCase() +
                        device.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};

export default DeviceSelection;
