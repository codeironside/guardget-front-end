import React from "react";

const InfoPanel: React.FC = () => {
  return (
    <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Important Information
      </h3>
      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>
            The recipient must have a Guardget account to receive the device.
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>
            They will receive an email with instructions to accept the transfer.
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>The transfer would be approved after.</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>You will be notified once the transfer is complete.</span>
        </li>
      </ul>
    </div>
  );
};

export default InfoPanel;
