import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Shield,
  Smartphone,
  RefreshCw,
  Users,
  BookOpen,
  Lightbulb,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
}

const FaqPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "What is Device Registry and how does it work?",
      answer:
        "Device Registry is a comprehensive security platform that helps you register, track, and manage your electronic devices. Our system creates a secure digital record of your device ownership, making it easier to verify authenticity, prevent theft, and facilitate secure transfers. When you register a device, we store its unique identifiers (like IMEI, serial numbers) in our encrypted database, creating an immutable ownership record.",
      category: "general",
      popular: true,
    },
    {
      id: "2",
      question: "How do I register my device on the platform?",
      answer:
        "Registering your device is simple and secure. First, log into your account and navigate to the 'Register Device' section in your dashboard. You'll need to provide basic device information such as device type, model, serial number or IMEI, and upload photos for verification. Our system will guide you through each step, and the entire process typically takes less than 5 minutes. Once registered, you'll receive a confirmation email with your device registration certificate.",
      category: "registration",
      popular: true,
    },
    {
      id: "3",
      question: "What should I do if I lose my device?",
      answer:
        "If you lose your device, act quickly to protect yourself. Immediately log into your Device Registry account and use our 'Report Device' feature to mark it as lost or stolen. This instantly updates our global database and prevents unauthorized ownership transfers. You should also contact local authorities and your insurance provider. Our system can generate an official loss report that's accepted by most insurance companies and law enforcement agencies.",
      category: "security",
      popular: true,
    },
    {
      id: "4",
      question: "How does the device ownership transfer process work?",
      answer:
        "Our secure transfer system ensures legitimate device ownership changes. To transfer a device, go to 'Transfer Ownership' in your dashboard, enter the recipient's email address, select a reason for transfer (gift, sale, etc.), and provide any additional details. The system sends an OTP to your registered phone number for verification. Once verified, the recipient receives an email with instructions to accept the transfer. The entire process is logged and creates an immutable transfer record.",
      category: "transfer",
      popular: true,
    },
    {
      id: "5",
      question: "How secure is my device information?",
      answer:
        "Security is our top priority. We use bank-level encryption (AES-256) to protect all device data. Your information is stored in secure, geographically distributed data centers with 24/7 monitoring. We implement multi-factor authentication, regular security audits, and comply with international data protection standards including GDPR. Your device information is never shared with third parties without your explicit consent.",
      category: "security",
    },
    {
      id: "6",
      question: "Can I verify if a device is stolen before purchasing?",
      answer:
        "Yes! Our device verification system is one of our most valuable features. Before purchasing any used device, you can use our 'Verify Device' tool by entering the device's IMEI or serial number. Our system instantly checks against our global database of reported stolen devices. This verification is free and helps prevent you from unknowingly purchasing stolen property.",
      category: "verification",
    },
    {
      id: "7",
      question: "What types of devices can I register?",
      answer:
        "You can register a wide variety of electronic devices including smartphones, tablets, laptops, desktop computers, gaming consoles, smart watches, cameras, and other valuable electronics. Our system supports any device with a unique identifier like IMEI, serial number, or model number. We're continuously expanding our supported device categories based on user needs.",
      category: "registration",
    },
    {
      id: "8",
      question: "How much does Device Registry cost?",
      answer:
        "We offer flexible pricing plans to suit different needs. Our basic plan starts at an affordable rate for individual users, with premium plans available for families and businesses. We also offer enterprise solutions for large organizations. You can view detailed pricing information on our pricing page. All plans include core security features, with advanced features available in higher tiers.",
      category: "pricing",
    },
    {
      id: "9",
      question:
        "What happens if someone tries to transfer my device without permission?",
      answer:
        "Our security system includes multiple safeguards against unauthorized transfers. Every transfer requires OTP verification sent to the registered owner's phone number. If someone attempts an unauthorized transfer, you'll receive immediate email and SMS alerts. You can instantly block the transfer through our emergency response system. All transfer attempts are logged with IP addresses and timestamps for security purposes.",
      category: "security",
    },
    {
      id: "10",
      question: "Can I register devices I've already purchased secondhand?",
      answer:
        "Yes, you can register previously owned devices, but we recommend verifying their status first. Use our verification tool to ensure the device isn't reported as stolen. If the device has a clean history, you can register it normally. If there's an existing registration, you may need to contact the previous owner to initiate a proper transfer. This helps maintain the integrity of our ownership records.",
      category: "registration",
    },
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: BookOpen },
    { id: "general", name: "General", icon: HelpCircle },
    { id: "registration", name: "Registration", icon: Smartphone },
    { id: "security", name: "Security", icon: Shield },
    { id: "transfer", name: "Transfer", icon: RefreshCw },
    { id: "verification", name: "Verification", icon: Search },
    { id: "pricing", name: "Pricing", icon: Users },
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFaqs = faqs.filter((faq) => faq.popular);

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions about Device Registry. Can't find
              what you're looking for? Our support team is here to help.
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                placeholder="Search for answers..."
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-primary text-white shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Popular Questions Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Popular Questions
                  </h3>
                </div>
                <div className="space-y-3">
                  {popularFaqs.map((faq, index) => (
                    <button
                      key={faq.id}
                      onClick={() => {
                        setSelectedCategory("all");
                        setSearchQuery("");
                        toggleFaq(faq.id);
                        // Scroll to the FAQ
                        const element = document.getElementById(
                          `faq-${faq.id}`
                        );
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-left w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary">
                        {faq.question}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No questions found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                ) : (
                  filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      id={`faq-${faq.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center flex-1">
                          {faq.popular && (
                            <div className="flex items-center mr-3">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                          )}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                            {faq.question}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                            openFaq === faq.id ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {openFaq === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="pt-4">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>
          </div>

          {/* Contact Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 md:p-12 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Still Need Help?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our friendly support
                team is here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/contact")}
                  className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg inline-flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Support
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
