import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Users,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  const navigationItems = [
    { label: "Home", path: "/" },
    {
      label: "Services",
      path: "/services",
      hasDropdown: true,
      dropdown: [
        {
          title: "Device Protection",
          description: "Comprehensive security for all your devices",
          icon: Shield,
          path: "/services/protection",
        },
        {
          title: "Recovery Service",
          description: "24/7 professional device recovery assistance",
          icon: MapPin,
          path: "/services/recovery",
        },
        {
          title: "Tracking Solutions",
          description: "Real-time GPS tracking and alerts",
          icon: Clock,
          path: "/services/tracking",
        },
        {
          title: "Support Center",
          description: "Expert help when you need it most",
          icon: Phone,
          path: "/services/support",
        },
      ],
    },
    { label: "Pricing", path: "/pricing" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-gray-900 dark:bg-gray-950 text-white text-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+234 800 GUARD-GET</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@guardget.ng</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>10,000+ Protected Devices</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || location.pathname !== "/"
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isScrolled || location.pathname !== "/"
                    ? "bg-primary/10"
                    : "bg-white/10 backdrop-blur-sm"
                }`}
              >
                <Shield
                  className={`h-8 w-8 transition-colors duration-300 ${
                    isScrolled || location.pathname !== "/"
                      ? "text-primary"
                      : "text-white"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-2xl font-heading font-bold transition-colors duration-300 ${
                    isScrolled || location.pathname !== "/"
                      ? "text-gray-900 dark:text-white"
                      : "text-white"
                  }`}
                >
                  Guardget
                </span>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isScrolled || location.pathname !== "/"
                      ? "text-primary"
                      : "text-white/80"
                  }`}
                >
                  Device Protection
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                    >
                      <button
                        className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                          isActive(item.path)
                            ? "text-primary dark:text-primary"
                            : isScrolled || location.pathname !== "/"
                            ? "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                            : "text-gray-200 hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isServicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Services Dropdown */}
                      <AnimatePresence>
                        {isServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                          >
                            <div className="p-6">
                              <div className="space-y-4">
                                {item.dropdown?.map(
                                  (dropdownItem, dropIndex) => {
                                    const Icon = dropdownItem.icon;
                                    return (
                                      <Link
                                        key={dropIndex}
                                        to={dropdownItem.path}
                                        className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                                      >
                                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
                                          <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
                                            {dropdownItem.title}
                                          </h4>
                                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {dropdownItem.description}
                                          </p>
                                        </div>
                                      </Link>
                                    );
                                  }
                                )}
                              </div>
                              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <Link
                                  to="/services"
                                  className="flex items-center justify-center w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 text-sm font-medium"
                                >
                                  View All Services
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`text-sm font-medium transition-colors duration-200 ${
                        isActive(item.path)
                          ? "text-primary dark:text-primary"
                          : isScrolled || location.pathname !== "/"
                          ? "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                          : "text-gray-200 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isScrolled || location.pathname !== "/"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    : "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20"
                }`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link
                to="/login"
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isScrolled || location.pathname !== "/"
                    ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    : "text-gray-200 hover:bg-white/10 backdrop-blur-sm"
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Protected
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isScrolled || location.pathname !== "/"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    : "bg-white/10 backdrop-blur-sm text-gray-300"
                }`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={toggleMenu}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isScrolled || location.pathname !== "/"
                    ? "text-gray-600 dark:text-gray-300"
                    : "text-white"
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <div key={index}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                          className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-xl ${
                            isActive(item.path)
                              ? "text-primary dark:text-primary bg-primary/10"
                              : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isServicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isServicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mt-2 space-y-2"
                            >
                              {item.dropdown?.map((dropdownItem, dropIndex) => {
                                const Icon = dropdownItem.icon;
                                return (
                                  <Link
                                    key={dropIndex}
                                    to={dropdownItem.path}
                                    onClick={closeMenu}
                                    className="flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                  >
                                    <Icon className="h-4 w-4" />
                                    <span className="text-sm">
                                      {dropdownItem.title}
                                    </span>
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={closeMenu}
                        className={`block px-4 py-3 text-base font-medium rounded-xl ${
                          isActive(item.path)
                            ? "text-primary dark:text-primary bg-primary/10"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium bg-primary text-white rounded-xl hover:bg-primary-dark text-center"
                  >
                    Get Protected
                  </Link>
                </div>

                {/* Mobile Contact Info */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2 px-4">
                      <Phone className="h-4 w-4" />
                      <span>+234 800 GUARD-GET</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4">
                      <Mail className="h-4 w-4" />
                      <span>support@guardget.ng</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
