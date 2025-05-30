import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Smartphone,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const services = [
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "Device Protection",
      description:
        "Register your devices in our secure database for enhanced protection against theft and unauthorized use.",
      features: [
        "Secure registration",
        "Real-time monitoring",
        "24/7 protection",
      ],
      color: "blue",
    },
    {
      icon: <Smartphone className="w-12 h-12 text-emerald-500" />,
      title: "Device Verification",
      description:
        "Quick and easy verification system to check if a device has been reported as stolen or compromised.",
      features: ["Instant verification", "Global database", "Detailed reports"],
      color: "emerald",
    },
    {
      icon: <RefreshCw className="w-12 h-12 text-purple-500" />,
      title: "Ownership Transfer",
      description:
        "Seamless process for transferring device ownership when buying or selling registered devices.",
      features: ["Secure transfers", "OTP verification", "Transfer history"],
      color: "purple",
    },
    {
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      title: "Stolen Device Reporting",
      description:
        "Fast and efficient system for reporting stolen devices and alerting relevant authorities.",
      features: [
        "Instant reporting",
        "Authority alerts",
        "Recovery assistance",
      ],
      color: "red",
    },
  ];

  const stats = [
    { number: "50K+", label: "Protected Devices" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive device protection and verification services designed
              to keep your valuable electronics secure and give you peace of
              mind.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 p-8 h-full transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex flex-col h-full">
                    {/* Icon and Title */}
                    <div className="flex items-start mb-6">
                      <div className="flex-shrink-0 mr-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors duration-300">
                          {service.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="flex-grow">
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                          >
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Get started with our services in just a few simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Register Your Device",
                  description:
                    "Create an account and register your devices with our secure system",
                },
                {
                  step: "2",
                  title: "Verify & Protect",
                  description:
                    "Enable protection features and verify device authenticity",
                },
                {
                  step: "3",
                  title: "Stay Secure",
                  description:
                    "Monitor your devices and transfer ownership when needed",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Secure Your Devices?
                </h2>
                <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of users who trust us with their device
                  security. Get started today and protect what matters most.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg inline-flex items-center justify-center"
                  >
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/pricing")}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300"
                  >
                    View Pricing
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trusted by leading organizations
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Our security standards meet enterprise-level requirements with
                end-to-end encryption, regular security audits, and compliance
                with international data protection regulations.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
