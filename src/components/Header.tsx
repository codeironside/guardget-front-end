import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'FAQ', path: '/faq' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== '/'
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className={`h-8 w-8 ${
              isScrolled || location.pathname !== '/'
                ? 'text-primary dark:text-white'
                : 'text-white'
            }`} />
            <span className={`text-2xl font-heading font-bold ${
              isScrolled || location.pathname !== '/'
                ? 'text-primary dark:text-white'
                : 'text-white'
            }`}>
              Guardget
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary dark:text-primary'
                    : isScrolled || location.pathname !== '/'
                    ? 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isScrolled || location.pathname !== '/'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  : 'bg-gray-800 bg-opacity-50 text-gray-300'
              } hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              to="/login"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isScrolled || location.pathname !== '/'
                  ? 'text-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-gray-200 hover:text-white'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className={`p-2 mr-2 rounded-full ${
                isScrolled || location.pathname !== '/'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  : 'bg-gray-800 bg-opacity-50 text-gray-300'
              } hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={toggleMenu}
              className={`p-2 ${
                isScrolled || location.pathname !== '/'
                  ? 'text-gray-600 dark:text-gray-300'
                  : 'text-white'
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
        >
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={closeMenu}
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  isActive(item.path)
                    ? 'text-primary dark:text-primary bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/login"
                onClick={closeMenu}
                className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block px-3 py-2 mt-1 text-base font-medium bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;