import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Device {
  id: string;
  name: string;
  model: string;
  type: 'phone' | 'laptop';
  status: 'active' | 'reported' | 'missing' | 'stolen';
  serialNumber: string;
  imei?: string;
}

const TransferOwnershipPage = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch user's devices
    setTimeout(() => {
      setDevices([
        {
          id: '1',
          name: 'iPhone 14 Pro',
          model: 'A2650',
          type: 'phone',
          status: 'active',
          imei: '123456789012345',
          serialNumber: 'FFMX3LLFX'
        },
        {
          id: '2',
          name: 'MacBook Pro',
          model: '14-inch, 2023',
          type: 'laptop',
          status: 'active',
          serialNumber: 'C02G30TXQ6L7'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDevice || !recipientEmail || !confirmEmail) {
      setError('Please fill in all required fields');
      return;
    }

    if (recipientEmail !== confirmEmail) {
      setError('Email addresses do not match');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Transfer request has been sent successfully. The recipient will receive an email to confirm the transfer.');
      setSelectedDevice('');
      setRecipientEmail('');
      setConfirmEmail('');
    } catch (error) {
      setError('Failed to initiate transfer. Please try again.');
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
          <Send className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transfer Device Ownership</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="device" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                {devices.filter(d => d.status === 'active').map(device => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({device.type === 'phone' ? `IMEI: ${device.imei}` : `S/N: ${device.serialNumber}`})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recipient's Email
              </label>
              <input
                type="email"
                id="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="input-field"
                placeholder="Enter recipient's email address"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Recipient's Email
              </label>
              <input
                type="email"
                id="confirmEmail"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="input-field"
                placeholder="Confirm recipient's email address"
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
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Transfer Ownership
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Important Information</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• The recipient must have a Guardget account to receive the device.</li>
            <li>• They will receive an email with instructions to accept the transfer.</li>
            <li>• The transfer must be accepted within 48 hours.</li>
            <li>• You will be notified once the transfer is complete.</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default TransferOwnershipPage;