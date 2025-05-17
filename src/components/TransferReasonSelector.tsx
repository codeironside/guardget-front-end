// components/TransferReasonSelector.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  ShoppingBag,
  HeartHandshake,
  PenLine,
  ChevronDown,
  Check,
} from "lucide-react";

interface TransferReasonOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface TransferReasonSelectorProps {
  selectedReason: string;
  setSelectedReason: (reason: string) => void;
  customReason: string;
  setCustomReason: (reason: string) => void;
  disabled?: boolean;
}

const TransferReasonSelector: React.FC<TransferReasonSelectorProps> = ({
  selectedReason,
  setSelectedReason,
  customReason,
  setCustomReason,
  disabled = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Define transfer reason options
  const reasonOptions: TransferReasonOption[] = [
    {
      id: "gift",
      label: "Gift",
      icon: <Gift className="h-5 w-5 text-pink-500" />,
      description: "I'm giving this device as a gift",
    },
    {
      id: "sold",
      label: "Sold",
      icon: <ShoppingBag className="h-5 w-5 text-emerald-500" />,
      description: "I've sold this device to the recipient",
    },
    {
      id: "transfer_ownership",
      label: "Transfer Ownership",
      icon: <HeartHandshake className="h-5 w-5 text-blue-500" />,
      description: "Transferring to a family member or colleague",
    },
    {
      id: "other",
      label: "Other",
      icon: <PenLine className="h-5 w-5 text-purple-500" />,
      description: "Specify your own reason",
    },
  ];

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

  const handleSelectReason = (reasonId: string) => {
    setSelectedReason(reasonId);
    setDropdownOpen(false);

    // If not "other", clear the custom reason
    if (reasonId !== "other") {
      setCustomReason("");
    }
  };

  // Get the selected reason details
  const getSelectedReasonOption = () => {
    return reasonOptions.find((option) => option.id === selectedReason);
  };

  return (
    <div>
      <label
        htmlFor="transferReason"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Reason for Transfer
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
            {selectedReason ? (
              <>
                <span className="mr-2">{getSelectedReasonOption()?.icon}</span>
                <span>{getSelectedReasonOption()?.label}</span>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                Select reason for transfer
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
          {dropdownOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 text-base overflow-auto focus:outline-none max-h-60"
            >
              {reasonOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSelectReason(option.id)}
                  className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ${
                    selectedReason === option.id
                      ? "bg-gray-100 dark:bg-gray-600"
                      : ""
                  }`}
                >
                  <div className="mr-3">{option.icon}</div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        selectedReason === option.id
                          ? "text-primary"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                  {selectedReason === option.id && (
                    <Check className="h-5 w-5 text-primary ml-2" />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Show custom reason input when "Other" is selected */}
      <AnimatePresence>
        {selectedReason === "other" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter your reason for transfer"
              className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={disabled}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransferReasonSelector;
