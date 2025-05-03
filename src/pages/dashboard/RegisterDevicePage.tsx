import React from 'react';
import { Shield } from 'lucide-react';

const RegisterDevicePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Register New Device</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700">
                Device Name
              </label>
              <input
                type="text"
                id="deviceName"
                name="deviceName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter device name"
              />
            </div>

            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                Serial Number
              </label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter serial number"
              />
            </div>

            <div>
              <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700">
                Device Type
              </label>
              <select
                id="deviceType"
                name="deviceType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select device type</option>
                <option value="smartphone">Smartphone</option>
                <option value="tablet">Tablet</option>
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
                Purchase Date
              </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter any additional information about the device"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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