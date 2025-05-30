import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Clock,
  Globe,
  Target,
  Heart,
  Lightbulb,
  Award,
  ArrowRight,
  Zap,
  Lock,
  TrendingUp,
  CheckCircle,
  Star,
  Building2,
  Smartphone,
  Database,
} from "lucide-react";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  // Stats data
  const stats = [
    {
      icon: Shield,
      label: "Protected Devices",
      value: "50K+",
      description: "Devices secured worldwide",
      color: "text-emerald-500",
    },
    {
      icon: Users,
      label: "Active Users",
      value: "10K+",
      description: "Trusted by users globally",
      color: "text-blue-500",
    },
    {
      icon: Clock,
      label: "Years of Service",
      value: "5+",
      description: "Years protecting devices",
      color: "text-purple-500",
    },
    {
      icon: Globe,
      label: "Countries Served",
      value: "25+",
      description: "Countries we operate in",
      color: "text-amber-500",
    },
  ];

  // Core values data
  const values = [
    {
      icon: Lock,
      title: "Security First",
      description:
        "We prioritize the protection of our users' devices and data above all else. Every feature we build undergoes rigorous security testing.",
      color: "bg-red-500",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Constantly evolving our technology to stay ahead of emerging threats and provide cutting-edge solutions for device protection.",
      color: "bg-yellow-500",
    },
    {
      icon: Heart,
      title: "User Trust",
      description:
        "Building lasting relationships through transparency, reliability, and exceptional customer service that exceeds expectations.",
      color: "bg-pink-500",
    },
    {
      icon: Target,
      title: "Excellence",
      description:
        "We strive for perfection in everything we do, from our platform's performance to our customer support experience.",
      color: "bg-blue-500",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Fostering a global community of users who help each other stay secure and share best practices for device protection.",
      color: "bg-green-500",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description:
        "Continuously improving our services and expanding our reach to help more people protect their valuable devices.",
      color: "bg-purple-500",
    },
  ];

  // Journey milestones
  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to revolutionize device protection",
    },
    {
      year: "2023",
      title: "First 1K Users",
      description: "Reached our first milestone of 1,000 registered users",
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded operations to serve users across 25+ countries",
    },
    {
      year: "2024",
      title: "Major Platform Update",
      description: "Launched enhanced security features and mobile app",
    },
    {
      year: "2025",
      title: "Industry Recognition",
      description: "Received awards for innovation in device security",
    },
  ];

  // Team features
  const teamFeatures = [
    {
      icon: Smartphone,
      title: "Mobile-First Approach",
      description: "Optimized for modern mobile device protection",
    },
    {
      icon: Database,
      title: "Secure Database",
      description: "Industry-leading encryption and data protection",
    },
    {
      icon: Building2,
      title: "Enterprise Ready",
      description: "Scalable solutions for businesses of all sizes",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary via-primary-dark to-blue-800 py-20 lg:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                Trusted by 10K+ Users Worldwide
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Protecting Digital
                <br />
                <span className="text-blue-200">Assets Worldwide</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
                We're dedicated to making device protection and verification
                accessible to everyone, ensuring a safer digital world for all
                through innovative technology and trusted solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/services")}
                  className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg inline-flex items-center justify-center"
                >
                  Explore Our Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/contact")}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  Contact Us
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Revolutionizing Device{" "}
                <span className="text-primary">Security</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Founded in 2023, we've made it our mission to revolutionize how
                people protect and verify their digital devices. Through
                innovative technology and user-friendly solutions, we're
                building a more secure digital ecosystem that everyone can
                trust.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Our platform serves thousands of users worldwide, helping them
                safeguard their devices and maintain peace of mind in an
                increasingly connected world. We believe that security should be
                accessible, reliable, and easy to use.
              </p>

              {/* Features List */}
              <div className="space-y-4">
                {teamFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Journey Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Clock className="w-6 h-6 text-primary mr-3" />
                  Our Journey
                </h3>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {milestone.year.slice(-2)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {milestone.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white dark:bg-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Our Core Values
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What Drives Us <span className="text-primary">Forward</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our values shape everything we do, from the products we build to
              the relationships we foster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group"
              >
                <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl border border-gray-200 dark:border-gray-600 h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${value.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <Zap className="w-16 h-16 mx-auto mb-6 opacity-90" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Secure Your Devices?
                </h2>
                <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of users who trust us with their device
                  security. Start protecting what matters most to you today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/register")}
                    className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg inline-flex items-center justify-center"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/pricing")}
                    className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  >
                    View Pricing
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
