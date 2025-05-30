import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Globe,
  Send,
  User,
  AtSign,
  PenTool,
  Facebook,
  Twitter,
  Music,
  ArrowRight,
  CheckCircle,
  Headphones,
  Zap,
} from "lucide-react";

interface ContactMethod {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
  color: string;
  bgColor: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);

    // Show success message (you can implement your own notification system)
    alert("Message sent successfully! We'll get back to you soon.");
  };

  // Contact methods
  const contactMethods: ContactMethod[] = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Speak directly with our team",
      action: () => window.open("tel:+2348036372936", "_self"),
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "Send us a detailed message",
      action: () => window.open("mailto:hello@guardget.com", "_self"),
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Get instant support",
      action: () => {
        // You can integrate with your chat system here
        alert("Live chat feature coming soon!");
      },
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  // Social media links
  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: "https://facebook.com/guardget",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: "https://twitter.com/guardget",
      color: "hover:text-sky-500",
    },
    {
      name: "TikTok",
      icon: <Music className="w-5 h-5" />,
      url: "https://tiktok.com/@guardget",
      color: "hover:text-pink-600",
    },
  ];

  // Support hours
  const supportHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
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
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Headphones className="w-4 h-4 mr-2" />
              24/7 Support Available
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions about GuardGet? We're here to help! Reach out to
              our friendly support team and we'll get back to you as soon as
              possible.
            </p>
          </motion.div>

          {/* Quick Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {contactMethods.map((method, index) => (
              <motion.button
                key={index}
                onClick={method.action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${method.bgColor} p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 text-left group`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${method.color} bg-white dark:bg-gray-800 mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {method.description}
                </p>
              </motion.button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              {/* Contact Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Globe className="w-5 h-5 text-primary mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Email
                      </h4>
                      <a
                        href="mailto:hello@guardget.com"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                      >
                        hello@guardget.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg mr-3">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Phone
                      </h4>
                      <a
                        href="tel:+2348036372936"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                      >
                        +234 803 637 2936
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg mr-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Office
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Lagos, Nigeria
                        <br />
                        West Africa
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Hours */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Clock className="w-5 h-5 text-primary mr-2" />
                  Support Hours
                </h3>
                <div className="space-y-3">
                  {supportHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {schedule.day}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Zap className="w-5 h-5 text-primary mr-2" />
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-300 hover:shadow-lg`}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Stay updated with the latest news and tips from GuardGet
                </p>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Quick Response Tips
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Include your device details for faster support</li>
                  <li>• Attach screenshots if reporting issues</li>
                  <li>• Use our live chat for urgent matters</li>
                  <li>• Check our FAQ section first</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
