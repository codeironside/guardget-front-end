import React from 'react';
import { Shield, Smartphone, RefreshCw, AlertTriangle } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: "Device Protection",
      description: "Register your devices in our secure database for enhanced protection against theft and unauthorized use."
    },
    {
      icon: <Smartphone className="w-12 h-12 text-green-600" />,
      title: "Device Verification",
      description: "Quick and easy verification system to check if a device has been reported as stolen or compromised."
    },
    {
      icon: <RefreshCw className="w-12 h-12 text-purple-600" />,
      title: "Ownership Transfer",
      description: "Seamless process for transferring device ownership when buying or selling registered devices."
    },
    {
      icon: <AlertTriangle className="w-12 h-12 text-red-600" />,
      title: "Stolen Device Reporting",
      description: "Fast and efficient system for reporting stolen devices and alerting relevant authorities."
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive device protection and verification services to keep your valuable electronics secure.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 transform transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-600 text-white rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Secure Your Devices?
            </h2>
            <p className="text-lg mb-6">
              Join thousands of users who trust us with their device security
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;