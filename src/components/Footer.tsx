import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Twitter, Music, Linkedin, Globe } from "lucide-react";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  // Check if user is authenticated (you may need to adjust this based on your auth system)
  const isAuthenticated = () => {
    // Check for auth token in localStorage, context, or wherever you store it
    return (
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      false
    );
  };

  // Handle device checker navigation
  const handleDeviceChecker = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isAuthenticated()) {
      // Redirect to dashboard if user is signed in
      navigate("/dashboard");
    } else {
      // Redirect to login if user is not signed in
      navigate("/login");
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-800 text-secondary dark:text-white pt-12 pb-8 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-heading font-bold text-primary mb-4">
              Guardget
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Miss-Call, Not Miss-Phone. Protect your devices with our
              innovative tracking and anti-theft solution.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/guardget"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/guardget"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://tiktok.com/@guardget"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Music size={20} />
              </a>
              <a
                href="https://linkedin.com/company/guardget"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://guardget.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handleDeviceChecker}
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Device Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Meet the Nerds
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <address className="not-italic text-gray-600 dark:text-gray-300 space-y-2">
              <p>Lagos, Nigeria</p>
              <p>West Africa</p>
              <p>
                Phone:
                <a
                  href="tel:+2348036372936"
                  className="hover:text-primary transition-colors ml-1"
                >
                  +234 803 637 2936
                </a>
              </p>
              <p>
                Email:
                <a
                  href="mailto:hello@guardget.com"
                  className="hover:text-primary transition-colors ml-1"
                >
                  hello@guardget.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} Guardget. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
