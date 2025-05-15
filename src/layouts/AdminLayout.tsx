import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Smartphone,
  CreditCard,
  Receipt,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Send,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const AdminLayout: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/admin/dashboard" },
    { label: "Users", icon: <Users size={20} />, path: "/admin/users" },
    {
      label: "Devices",
      icon: <Smartphone size={20} />,
      path: "/admin/devices",
    },
    { label: "Transfers", icon: <Send size={20} />, path: "/admin/transfers" },
    {
      label: "Subscriptions",
      icon: <CreditCard size={20} />,
      path: "/admin/subscriptions",
    },
    { label: "Receipts", icon: <Receipt size={20} />, path: "/admin/receipts" },
    { label: "Profile", icon: <User size={20} />, path: "/admin/profile" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  // Calculate user initials
  const getUserInitials = (): string => {
    if (!user) return "A"; // Default for admin if no user

    if (user.firstName) {
      const firstInitial = user.firstName[0] || "";
      const lastInitial = user.surName?.[0] || user.lastName?.[0] || "";
      return (firstInitial + lastInitial).toUpperCase();
    }

    // Fallbacks if firstName is not available
    if (user.username) return user.username.substring(0, 2).toUpperCase();
    if (user.email) return user.email.substring(0, 2).toUpperCase();

    return "A"; // Default fallback
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-secondary dark:text-white transition-colors duration-300">
      {/* Mobile menu button */}
      <button
        className="fixed z-50 bottom-4 right-4 md:hidden bg-primary text-white p-3 rounded-full shadow-lg"
        onClick={toggleMobile}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col ${
          expanded ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-md`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {expanded && (
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-primary transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 pt-6 px-2 space-y-1">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center ${
                expanded ? "justify-start" : "justify-center"
              } px-4 py-3 rounded-md text-sm font-medium transition-colors w-full ${
                isActive(item.path)
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span>{item.icon}</span>
              {expanded && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              expanded ? "justify-start" : "justify-center"
            } px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-error`}
          >
            <LogOut size={20} />
            {expanded && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-0 z-40 flex md:hidden bg-black bg-opacity-50 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex flex-col w-64 max-w-xs bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out ${
            mobileOpen ? "transform-none" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
            <button
              onClick={toggleMobile}
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 pt-6 px-2 space-y-1 overflow-y-auto">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center justify-start px-4 py-3 rounded-md text-sm font-medium transition-colors w-full ${
                  isActive(item.path)
                    ? "bg-primary bg-opacity-10 text-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span>{item.icon}</span>
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center justify-start px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-error"
            >
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="flex items-center">
                {user?.imageurl ? (
                  // Display profile image if available
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={user.imageurl}
                      alt={`${user.firstName}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  // Display initials if no image is available
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {getUserInitials()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
