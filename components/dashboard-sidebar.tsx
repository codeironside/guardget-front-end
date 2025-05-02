"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Menu,
  X,
  Smartphone,
  Search,
  LogOut,
  LayoutDashboard,
  Settings,
  Receipt,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardSidebarProps {
  user: any;
  onLogout: () => void;
}

const DashboardSidebar = ({ user, onLogout }: DashboardSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isMobile = useMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Initialize sidebar state
    if (!isMobile) {
      const savedState = localStorage.getItem("sidebarCollapsed");
      setIsCollapsed(savedState === "true");
    }
  }, [isMobile]);

  useEffect(() => {
    // Handle clicks outside sidebar to close it on mobile
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      localStorage.setItem("sidebarCollapsed", String(newState));
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleMouseEnter = () => {
    if (!isMobile && isCollapsed) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && isCollapsed) {
      setIsHovering(false);
    }
  };

  const sidebarWidth = isCollapsed && !isHovering ? "w-16" : "w-64";
  const sidebarTransition = "transition-all duration-300 ease-in-out";

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-background border-r",
          sidebarWidth,
          sidebarTransition,
          isMobile
            ? isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 overflow-hidden"
            >
              <Shield className="h-6 w-6 text-primary flex-shrink-0" />
              <span
                className={cn(
                  "font-anta text-lg whitespace-nowrap",
                  isCollapsed && !isHovering ? "hidden" : "block"
                )}
              >
                Guardget
              </span>
            </Link>
            <button
              onClick={toggleSidebar}
              className={cn(
                "p-2 rounded-md hover:bg-accent",
                isCollapsed && !isHovering && !isMobile ? "hidden" : "block"
              )}
            >
              {isMobile ? (
                <X className="h-5 w-5" />
              ) : isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          <div
            className={cn(
              "flex items-center p-4 border-b",
              isCollapsed && !isHovering ? "justify-center" : ""
            )}
          >
            <Avatar className="h-10 w-10">
              {user?.imageurl ? (
                <AvatarImage
                  src={user.imageurl || "/placeholder.svg"}
                  alt={user?.firstName || "User"}
                />
              ) : (
                <AvatarFallback>
                  {user?.firstName?.charAt(0) || "U"}
                  {user?.surName?.charAt(0) || ""}
                </AvatarFallback>
              )}
            </Avatar>
            <div
              className={cn(
                "ml-3 overflow-hidden",
                isCollapsed && !isHovering ? "hidden" : "block"
              )}
            >
              <p className="font-medium truncate">
                {user?.firstName} {user?.surName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                isActive("/dashboard")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                isCollapsed && !isHovering ? "justify-center" : ""
              )}
              onClick={closeSidebar}
            >
              <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(isCollapsed && !isHovering ? "hidden" : "block")}
              >
                Dashboard
              </span>
            </Link>

            <Link
              href="/dashboard/devices"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                isActive("/dashboard/devices")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                isCollapsed && !isHovering ? "justify-center" : ""
              )}
              onClick={closeSidebar}
            >
              <Smartphone className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(isCollapsed && !isHovering ? "hidden" : "block")}
              >
                My Devices
              </span>
            </Link>

            <Link
              href="/dashboard/device-status"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                isActive("/dashboard/device-status")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                isCollapsed && !isHovering ? "justify-center" : ""
              )}
              onClick={closeSidebar}
            >
              <Search className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(isCollapsed && !isHovering ? "hidden" : "block")}
              >
                Device Status
              </span>
            </Link>

            <Link
              href="/dashboard/receipts"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                isActive("/dashboard/receipts")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                isCollapsed && !isHovering ? "justify-center" : ""
              )}
              onClick={closeSidebar}
            >
              <Receipt className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(isCollapsed && !isHovering ? "hidden" : "block")}
              >
                Receipts
              </span>
            </Link>

            <Link
              href="/dashboard/subscription"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                isActive("/dashboard/subscription")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                isCollapsed && !isHovering ? "justify-center" : ""
              )}
              onClick={closeSidebar}
            >
              <CreditCard className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(isCollapsed && !isHovering ? "hidden" : "block")}
              >
                Subscription
              </span>
            </Link>

            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                isActive("/dashboard/settings")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                isCollapsed && !isHovering ? "justify-center" : ""
              )}
              onClick={closeSidebar}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(isCollapsed && !isHovering ? "hidden" : "block")}
              >
                Settings
              </span>
            </Link>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className={cn(
                "w-full flex items-center justify-center",
                isCollapsed && !isHovering ? "px-2" : ""
              )}
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span
                className={cn(
                  "ml-2",
                  isCollapsed && !isHovering ? "hidden" : "block"
                )}
              >
                Logout
              </span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
