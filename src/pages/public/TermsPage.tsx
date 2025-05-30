import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  ArrowDown,
  ArrowRight,
  Smartphone,
  Globe,
  Mail,
  Phone,
  CreditCard,
  UserCheck,
  Settings,
  Trash2,
  Download,
  Share2,
} from "lucide-react";

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const [readProgress, setReadProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAcceptButton, setShowAcceptButton] = useState(false);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadProgress(Math.min(progress, 100));

      // Show accept button when user reaches 90% of the page
      if (progress >= 90 && !hasReachedEnd) {
        setHasReachedEnd(true);
        setShowAcceptButton(true);
      }

      // Determine current section based on scroll position
      const sections = document.querySelectorAll(".terms-section");
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasReachedEnd]);

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Welcome to GuardGet ("we," "our," or "us"). These Terms and
            Conditions ("Terms") govern your use of our device protection and
            verification services, including our website, mobile applications,
            and related services (collectively, the "Service").
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                By accessing or using GuardGet, you agree to be bound by these
                Terms. If you disagree with any part of these Terms, you may not
                access the Service.
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      ),
    },
    {
      id: "data-collection",
      title: "Data Collection & Why We Need It",
      icon: <Database className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We collect and process your data to provide our device protection
            services effectively. Here's what we collect and why:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <UserCheck className="w-5 h-5 text-emerald-500 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h4>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Name and email address</li>
                <li>• Phone number for OTP verification</li>
                <li>• Profile information you provide</li>
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <strong>Why:</strong> To create your account, verify your
                identity, and communicate important updates about your devices.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <Smartphone className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Device Information
                </h4>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• IMEI, serial numbers</li>
                <li>• Device model and specifications</li>
                <li>• Photos of your devices</li>
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <strong>Why:</strong> To create unique device fingerprints,
                verify ownership, and help in recovery if stolen.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <Globe className="w-5 h-5 text-purple-500 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Usage Data
                </h4>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• IP address and browser type</li>
                <li>• Service usage patterns</li>
                <li>• Error logs and diagnostics</li>
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <strong>Why:</strong> To improve our services, fix bugs, and
                ensure platform security.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <CreditCard className="w-5 h-5 text-amber-500 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Payment Information
                </h4>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Billing address</li>
                <li>• Payment method details</li>
                <li>• Transaction history</li>
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <strong>Why:</strong> To process subscriptions and provide
                billing support. Payment details are securely handled by our
                payment processors.
              </p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-300">
                  Data Protection Promise
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  We use bank-level encryption (AES-256) to protect your data.
                  We never sell your personal information to third parties, and
                  you maintain full control over your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "service-description",
      title: "Our Services",
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            GuardGet provides the following services to protect your valuable
            devices:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Device Registration",
                desc: "Secure registration of your devices in our global database",
              },
              {
                title: "Ownership Verification",
                desc: "Instant verification of device ownership and authenticity",
              },
              {
                title: "Transfer Management",
                desc: "Secure transfer of device ownership with OTP verification",
              },
              {
                title: "Theft Reporting",
                desc: "Fast reporting system for stolen or lost devices",
              },
              {
                title: "Global Database",
                desc: "Access to our worldwide database of registered devices",
              },
              {
                title: "24/7 Monitoring",
                desc: "Continuous monitoring and alert systems",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "user-rights",
      title: "Your Rights & Control",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            You have comprehensive rights regarding your personal data and how
            we use it:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-3">
                <Eye className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                  Right to Access
                </h4>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Request a copy of all personal data we hold about you, including
                device records and account information.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center mb-3">
                <Settings className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800 dark:text-green-300">
                  Right to Rectification
                </h4>
              </div>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Correct any inaccurate or incomplete personal data we hold about
                you at any time.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center mb-3">
                <Trash2 className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-semibold text-red-800 dark:text-red-300">
                  Right to Erasure
                </h4>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Request deletion of your personal data, subject to legal and
                safety requirements.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center mb-3">
                <Download className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-800 dark:text-purple-300">
                  Data Portability
                </h4>
              </div>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Export your data in a machine-readable format to transfer to
                another service.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-300">
                  Exercise Your Rights
                </h4>
                <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:hello@guardget.com" className="underline">
                    hello@guardget.com
                  </a>{" "}
                  or through your account settings. We'll respond within 30
                  days.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "responsibilities",
      title: "User Responsibilities",
      icon: <UserCheck className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            As a GuardGet user, you agree to:
          </p>
          <div className="space-y-3">
            {[
              "Provide accurate and truthful information about yourself and your devices",
              "Only register devices that you legally own or have authority to register",
              "Keep your account credentials secure and not share them with others",
              "Report lost or stolen devices promptly and accurately",
              "Use the service only for legitimate device protection purposes",
              "Comply with all applicable laws and regulations in your jurisdiction",
              "Not attempt to circumvent our security measures or access unauthorized data",
              "Respect other users' privacy and rights when using our platform",
            ].map((responsibility, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300">
                  {responsibility}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "data-sharing",
      title: "When We Share Data",
      icon: <Share2 className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We only share your data in specific, limited circumstances:
          </p>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                Law Enforcement Cooperation
              </h4>
              <p className="text-red-700 dark:text-red-300 text-sm">
                We may share device information with law enforcement agencies
                when investigating theft cases, but only with proper legal
                authorization and in accordance with applicable laws.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Service Providers
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                We work with trusted third-party providers for payment
                processing, email delivery, and cloud hosting. They can only
                access data necessary for their specific services and are bound
                by strict confidentiality agreements.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                Device Verification
              </h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                When someone uses our verification service to check a device, we
                only share whether the device is reported as stolen or missing -
                never your personal information.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      title: "Security Measures",
      icon: <Lock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We implement comprehensive security measures to protect your data:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Encryption",
                desc: "AES-256 encryption for data at rest and TLS 1.3 for data in transit",
              },
              {
                title: "Access Control",
                desc: "Multi-factor authentication and role-based access controls",
              },
              {
                title: "Regular Audits",
                desc: "Third-party security audits and penetration testing",
              },
              {
                title: "Monitoring",
                desc: "24/7 security monitoring and incident response team",
              },
              {
                title: "Data Centers",
                desc: "SOC 2 compliant data centers with physical security",
              },
              {
                title: "Backup & Recovery",
                desc: "Encrypted backups and disaster recovery procedures",
              },
            ].map((measure, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {measure.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {measure.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: <Phone className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            If you have any questions about these Terms or need to exercise your
            rights, please contact us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Email
                </h4>
              </div>
              <a
                href="mailto:hello@guardget.com"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                hello@guardget.com
              </a>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <Phone className="w-5 h-5 text-emerald-500 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Phone
                </h4>
              </div>
              <a
                href="tel:+2348036372936"
                className="text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                +234 803 637 2936
              </a>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Response Time:</strong> We aim to respond to all inquiries
              within 24 hours during business days. For urgent security matters,
              please call our support line directly.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index].id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAcceptTerms = () => {
    if (hasReachedEnd) {
      setAgreedToTerms(true);
      // You can save this agreement to localStorage or send to your backend
      localStorage.setItem("termsAccepted", new Date().toISOString());
      navigate("/dashboard"); // or wherever you want to redirect
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${readProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4 mr-2" />
              Legal Documents
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Terms & <span className="text-primary">Conditions</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Understanding how we protect your data and what we expect from our
              users
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(index)}
                        className={`w-full text-left p-2 rounded-lg transition-all duration-200 flex items-center ${
                          currentSection === index
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span className="mr-3">{section.icon}</span>
                        <span className="text-sm font-medium">
                          {section.title}
                        </span>
                      </button>
                    ))}
                  </nav>

                  {/* Progress Indicator */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Reading Progress</span>
                      <span>{Math.round(readProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${readProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-12">
                {sections.map((section, index) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="terms-section bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mr-4">
                        {React.cloneElement(section.icon, {
                          className: "w-6 h-6 text-primary",
                        })}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                    {section.content}
                  </motion.section>
                ))}
              </div>

              {/* Continue Reading Prompt */}
              <AnimatePresence>
                {readProgress < 90 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-xl shadow-2xl z-40"
                  >
                    <div className="flex items-center">
                      <ArrowDown className="w-5 h-5 mr-2 animate-bounce" />
                      <span className="text-sm font-medium">
                        Continue reading to accept terms
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Accept Terms Button */}
              <AnimatePresence>
                {showAcceptButton && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-12 text-center"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center mb-6">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to Accept Terms?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You've read through our terms and conditions. Click
                        below to accept and continue using GuardGet.
                      </p>
                      <motion.button
                        onClick={handleAcceptTerms}
                        disabled={!hasReachedEnd}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                      >
                        I Accept These Terms
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
