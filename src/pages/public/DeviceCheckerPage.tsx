import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, AlertTriangle, User, Calendar, MapPin } from 'lucide-react';

const DeviceCheckerPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'imei' | 'sn'>('imei');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<null | {
    status: 'clean' | 'stolen' | 'missing';
    ownerImage: string;
    deviceName: string;
    deviceModel: string;
    reportedDate?: string;
    location?: string;
    contactInfo?: string;
  }>(null);
  
  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier) return;
    
    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      // Demo data - in a real app, this would come from the API
      if (identifier === '123456789012345' || identifier === 'ABC123XYZ456') {
        setResult({
          status: 'stolen',
          ownerImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
          deviceName: 'iPhone 14 Pro',
          deviceModel: 'A2650',
          reportedDate: '2023-09-15',
          location: 'New York, USA',
          contactInfo: '+1 (555) 123-4567'
        });
      } else if (identifier === '987654321098765' || identifier === 'XYZ789ABC123') {
        setResult({
          status: 'missing',
          ownerImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
          deviceName: 'MacBook Pro',
          deviceModel: '14-inch, 2023',
          reportedDate: '2023-10-20',
          location: 'San Francisco, USA',
          contactInfo: '+1 (555) 987-6543'
        });
      } else {
        setResult({
          status: 'clean',
          ownerImage: '',
          deviceName: 'Unknown Device',
          deviceModel: 'Unknown Model'
        });
      }
      
      setIsChecking(false);
    }, 1500);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary dark:text-white mb-4">
              Device Status Checker
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Before purchasing a used device, check if it has been reported as stolen or missing. Enter the IMEI number for phones or serial number for laptops.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleCheck}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Identifier Type
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-primary"
                      value="imei"
                      checked={identifierType === 'imei'}
                      onChange={() => setIdentifierType('imei')}
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">IMEI (Phones)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-primary"
                      value="sn"
                      checked={identifierType === 'sn'}
                      onChange={() => setIdentifierType('sn')}
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Serial Number (Laptops)</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {identifierType === 'imei' ? 'IMEI Number' : 'Serial Number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="input-field pr-10"
                    placeholder={identifierType === 'imei' ? 'Enter 15-digit IMEI number' : 'Enter device serial number'}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {identifierType === 'imei' 
                    ? 'You can find the IMEI by dialing *#06# on your phone or checking in the settings.' 
                    : 'The serial number is usually on the bottom of the laptop or in system information.'}
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center"
                  disabled={isChecking || !identifier}
                >
                  {isChecking ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Check Status
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${
                result.status === 'clean' 
                  ? 'border-success' 
                  : result.status === 'missing'
                  ? 'border-warning'
                  : 'border-error'
              }`}
            >
              <div className="flex items-center mb-6">
                <div className={`rounded-full p-2 mr-4 ${
                  result.status === 'clean' 
                    ? 'bg-success bg-opacity-10 text-success' 
                    : result.status === 'missing'
                    ? 'bg-warning bg-opacity-10 text-warning'
                    : 'bg-error bg-opacity-10 text-error'
                }`}>
                  {result.status === 'clean' 
                    ? <CheckCircle className="h-6 w-6" />
                    : <AlertTriangle className="h-6 w-6" />
                  }
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary dark:text-white">
                    {result.status === 'clean' 
                      ? 'Device is Clean' 
                      : result.status === 'missing'
                      ? 'Device Reported Missing'
                      : 'Device Reported Stolen'
                    }
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {result.status === 'clean' 
                      ? 'This device has not been reported as lost or stolen.' 
                      : `This device has been reported as ${result.status}.`
                    }
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                <h4 className="text-md font-semibold text-secondary dark:text-white mb-4">Device Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 mr-2">Device:</span>
                    <span className="text-gray-800 dark:text-gray-200">{result.deviceName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 mr-2">Model:</span>
                    <span className="text-gray-800 dark:text-gray-200">{result.deviceModel}</span>
                  </div>
                </div>
              </div>

              {result.status !== 'clean' && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                    <h4 className="text-md font-semibold text-secondary dark:text-white mb-4">Report Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-primary mr-2" />
                        <span className="text-gray-800 dark:text-gray-200">Reported on {result.reportedDate}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-primary mr-2" />
                        <span className="text-gray-800 dark:text-gray-200">{result.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                    <h4 className="text-md font-semibold text-secondary dark:text-white mb-4">Owner Information</h4>
                    <div className="flex items-center">
                      {result.ownerImage && (
                        <img 
                          src={result.ownerImage} 
                          alt="Device Owner" 
                          className="w-10 h-10 rounded-full mr-4 object-cover"
                        />
                      )}
                      <div>
                        <p className="text-gray-800 dark:text-gray-200">Contact: {result.contactInfo}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Please contact the owner if you have information about this device.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {result.status === 'clean' && (
                <div className="mt-4 bg-success bg-opacity-10 text-success p-4 rounded-md">
                  <p className="text-sm">
                    This device appears to be clean. You can proceed with your purchase. 
                    Remember to ask for proper documentation from the seller.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          <div className="mt-12 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-secondary dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">What information do I need to check a device?</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  For phones, you'll need the IMEI number. For laptops and other devices, you'll need the serial number.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">How accurate is this information?</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Our database is updated in real-time when users report devices as lost or stolen. However, we can only show information for devices registered with Guardget.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">What should I do if I'm buying a used device?</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Always check the device status before purchasing, ask for original purchase receipts, and ensure the seller transfers ownership properly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeviceCheckerPage;