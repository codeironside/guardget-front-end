import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Smartphone,
  PlusCircle,
  AlertTriangle,
  Send,
  Search,
  User,
  LogOut,
  Menu,
  X,
  CreditCard,
  Receipt,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext"; // Assuming you have an AuthContext

const DashboardLayout: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user data from auth context
  const [userInitials, setUserInitials] = useState("");

  // Calculate user initials when user data changes
  useEffect(() => {
    console.log(`users initial ${JSON.stringify(user)}`)
    if (user) {
      let initials = "";

      // Handle different possible user object structures
      if (user.name) {
        // If user has a name property
        initials = user.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .toUpperCase();
      } else if (user.firstName || user.lastName) {
        // If user has firstName/lastName properties
        initials = `${(user.firstName || "")[0] || ""}${
          (user.lastName || "")[0] || ""
        }`.toUpperCase();
      } else if (user.username) {
        // If user has only a username
        initials = user.username.substring(0, 2).toUpperCase();
      } else if (user.email) {
        // Fall back to email if nothing else is available
        initials = user.email.substring(0, 2).toUpperCase();
      }

      // Ensure we have exactly 2 characters
      if (initials.length === 0) {
        initials = "US"; // Default for "User"
      } else if (initials.length === 1) {
        // If we only have one character, duplicate it
        initials = initials + initials;
      } else if (initials.length > 2) {
        // If we have more than 2 characters, truncate to 2
        initials = initials.substring(0, 2);
      }

      setUserInitials(initials);
    } else {
      setUserInitials("GU"); // Default fallback for Guest
    }
  }, [user]);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    {
      label: "My Devices",
      icon: <Smartphone size={20} />,
      path: "/dashboard/my-devices",
    },
    {
      label: "Register Device",
      icon: <PlusCircle size={20} />,
      path: "/dashboard/register-device",
    },
    {
      label: "Report Device",
      icon: <AlertTriangle size={20} />,
      path: "/dashboard/report-device",
    },
    {
      label: "Transfer Ownership",
      icon: <Send size={20} />,
      path: "/dashboard/transfer-ownership",
    },
    {
      label: "Device Status",
      icon: <Search size={20} />,
      path: "/dashboard/device-status",
    },
    {
      label: "Subscriptions",
      icon: <CreditCard size={20} />,
      path: "/dashboard/subscriptions",
    },
    {
      label: "Receipts",
      icon: <Receipt size={20} />,
      path: "/dashboard/receipts",
    },
    {
      label: "My Profile",
      icon: <User size={20} />,
      path: "/dashboard/profile",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from your auth context
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
            <h1 className="text-xl font-bold text-primary">Guardget</h1>
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
              } px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full`}
            >
              <span className="text-primary">{item.icon}</span>
              {expanded && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              expanded ? "justify-start" : "justify-center"
            } px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full`}
          >
            <span className="text-error-dark">
              <LogOut size={20} />
            </span>
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
            <h1 className="text-xl font-bold text-primary">Guardget</h1>
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
                className="flex items-center justify-start px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
              >
                <span className="text-primary">{item.icon}</span>
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center justify-start px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
            >
              <span className="text-error-dark">
                <LogOut size={20} />
              </span>
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold"
                  title={user?.name || user?.username || user?.email || "User"}
                >
                  {userInitials}
                </div>
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

export default DashboardLayout;
