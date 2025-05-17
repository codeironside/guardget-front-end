
import { AlertCircle } from "lucide-react";

const EmptyDevicesMessage: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No Devices Found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        You don't have any devices registered that can be transferred.
      </p>
      <button
        onClick={() => (window.location.href = "/devices/register")}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Register a New Device
      </button>
    </div>
  );
};

export default EmptyDevicesMessage;
