import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Smartphone,
  Laptop,
  Truck,
  MapPin,
  Headphones,
  Ban,
  Phone,
  AlertTriangle,
  Star,
  Clock,
  Users,
  CheckCircle,
  Search,
} from "lucide-react";
import { subscriptionApi, Subscription } from "../../api/subscriptions";
import LoadingSpinner from "../../components/LoadingSpinner";

const HomePage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await subscriptionApi.getAll();
        if (response.status === "success") {
          setSubscriptions(response.data);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Device Protection",
      description:
        "Register your devices and protect them from theft with our advanced tracking technology.",
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-warning" />,
      title: "Lost Device Reporting",
      description:
        "Quickly report lost or stolen devices and increase your chances of recovery.",
    },
    {
      icon: <Search className="h-8 w-8 text-secondary" />,
      title: "Status Checking",
      description:
        "Verify if a device is registered, lost, or stolen before making a purchase.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-success" />,
      title: "Ownership Transfer",
      description:
        "Safely transfer device ownership when selling or gifting your electronics.",
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero relative h-screen flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Guardget. Miss-Call, Not Miss-Phone.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            The ultimate device protection service that helps you track,
            recover, and protect your valuable electronics. Find your lost
            device from anywhere with ease, Sign up with Guardget to guard your
            devices like a knight in shining armor.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Sign up with Guardget
            </Link>
            <Link
              to="/device-checker"
              className="bg-white text-primary font-medium py-3 px-8 rounded-md transition-all duration-300 hover:bg-gray-100"
            >
              Check Device Status
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary dark:text-white mb-4">
              Services for Individuals
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Guardget provides comprehensive device protection services to keep
              your valuable electronics safe and recoverable.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                variants={fadeIn}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary dark:text-white mb-4">
              Choose Your Protection Plan
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg">
              Complete device protection with premium security services included
              in every plan.
            </p>
          </motion.div>

          {/* Premium Services Overview */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-secondary dark:text-white mb-3">
                Premium Services Included
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Every plan comes with our comprehensive security ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700"
                variants={fadeIn}
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-secondary dark:text-white mb-2">
                  Free Courier Service
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We'll deliver your recovered device directly to your doorstep
                  at no extra cost
                </p>
              </motion.div>

              {/* <motion.div
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700"
                variants={fadeIn}
              >
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-secondary dark:text-white mb-2">
                  Enhanced Tracking
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Real-time GPS tracking with movement alerts and location
                  history
                </p>
              </motion.div> */}

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700"
                variants={fadeIn}
              >
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-secondary dark:text-white mb-2">
                  24/7 Priority Support
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Dedicated recovery specialists available round the clock
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-700"
                variants={fadeIn}
              >
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Ban className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-secondary dark:text-white mb-2">
                  Anti-Sale Protection
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Automatic blacklisting prevents stolen devices from being sold
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700"
                variants={fadeIn}
              >
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-secondary dark:text-white mb-2">
                  Recovery Network
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Access to nationwide network of recovery agents and law
                  enforcement
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700"
                variants={fadeIn}
              >
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-secondary dark:text-white mb-2">
                  Emergency Hotline
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Instant access to emergency response team for theft reporting
                </p>
              </motion.div>
            </div>

            {/* Success Stats */}
            <motion.div
              className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 border border-primary/20"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-6">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="text-xl font-bold text-secondary dark:text-white">
                  Proven Track Record
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    95%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Recovery Success Rate
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    48hrs
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Average Recovery Time
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Support Availability
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    100%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Free Courier Service
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Pricing Plans */}
          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center text-error">
              <p>{error}</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {subscriptions.map((plan, index) => (
                <motion.div
                  key={plan._id}
                  variants={fadeIn}
                  className={`relative bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    index === 1
                      ? "border-primary ring-2 ring-primary/20 transform scale-105"
                      : "border-gray-200 dark:border-gray-600 hover:border-primary/50"
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-secondary dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-4xl font-bold text-primary mb-4">
                      ₦{plan.price.toLocaleString()}
                      <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">
                        /month
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                      <span>
                        Protect up to{" "}
                        <strong>{plan.NoOfDevices} devices</strong>
                      </span>
                    </li>
                    {plan.description && (
                      <li className="flex items-center text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                        <span>{plan.description}</span>
                      </li>
                    )}
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                      <span>All premium security services</span>
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                      <span>Free device recovery & delivery</span>
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                      <span>24/7 priority support</span>
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                      <span>Real-time tracking & alerts</span>
                    </li>
                  </ul>

                  <Link
                    to="/register"
                    className={`block w-full text-center py-4 rounded-xl font-semibold transition-all duration-200 ${
                      index === 1
                        ? "bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl"
                        : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-primary hover:text-white"
                    }`}
                  >
                    Get Started Today
                  </Link>

                  {index === 1 && (
                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        🔥 Best value for families & small businesses
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Additional Value Proposition */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-secondary dark:text-white mb-4">
                Why Choose Our Protection?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-secondary dark:text-white mb-2">
                    Comprehensive Protection
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    From theft prevention to recovery, we've got you covered
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-secondary dark:text-white mb-2">
                    Fast Response
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Quick action means better chances of device recovery
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-secondary dark:text-white mb-2">
                    Trusted by Thousands
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Join thousands of satisfied customers across Nigeria
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary dark:text-white mb-4">
              Why Choose Guardget?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how Guardget compares to other device tracking methods and
              discover our unique benefits.
            </p>
          </motion.div>

          <motion.div
            className="overflow-x-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-secondary dark:text-white">
                    Feature
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-secondary dark:text-white">
                    Guardget
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-secondary dark:text-white">
                    Network Provider
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-secondary dark:text-white">
                    Find My Device
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-secondary dark:text-white">
                    Physical Tracking
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    Works without network provider
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    Tracks powered-off devices
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    Anti-sale protection
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    Immutable user data
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <AlertTriangle className="h-5 w-5 text-error mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 lg:mb-0 lg:w-2/3">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Ready to protect your devices?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl">
                Join thousands of satisfied users who trust Guardget to keep
                their valuable electronics safe.
              </p>
            </div>
            <div>
              <Link
                to="/register"
                className="bg-white text-primary font-medium py-3 px-8 rounded-md transition-all duration-300 hover:bg-gray-100"
              >
                Get Started Today
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it — hear from our satisfied
              customers.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Sarah Johnson",
                role: "Photographer",
                quote:
                  "Thanks to Guardget, I recovered my laptop that was stolen during a photoshoot. The public device checker made it impossible for the thief to sell it!",
              },
              {
                name: "Michael Chen",
                role: "Business Owner",
                quote:
                  "I register all company devices with Guardget. The peace of mind knowing our data is protected even if a device is lost is absolutely priceless.",
              },
              {
                name: "Elena Rodriguez",
                role: "College Student",
                quote:
                  "After my phone was stolen on campus, Guardget's reporting system helped campus security identify and return it within 48 hours!",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                variants={fadeIn}
              >
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
