"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { useMediaQuery } from "@/hooks/use-media-query";

interface DashboardSidebarProps {
  user: any;
  onLogout: () => void;
}

const DashboardSidebar = ({ user, onLogout }: DashboardSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isMobile = useMobile();
  const isLargeScreen = useMediaQuery("(min-width: 768px)");
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    const initialState =
      savedState !== null ? savedState === "true" : !isLargeScreen;
    setIsCollapsed(initialState);
  }, [isLargeScreen]);

  useEffect(() => {
    const handleResize = () => {
      if (!isLargeScreen) {
        setIsCollapsed(true);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isLargeScreen]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isCollapsed));
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

  const handleMouseEnter = useCallback(() => {
    if (!isMobile && isCollapsed) {
      setIsHovering(true);
    }
  }, [isMobile, isCollapsed]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile && isCollapsed) {
      setIsHovering(false);
    }
  }, [isMobile, isCollapsed]);

  const isActive = useCallback(
    (path: string) => {
      return pathname === path;
    },
    [pathname]
  );

  const handleSidebarClick = useCallback(() => {
    isMobile && setIsSidebarOpen(false);
  }, [isMobile]);


  const sidebarWidth = isCollapsed && !isHovering ? "w-16" : "w-64";
  const sidebarTransition = "transition-all duration-300 ease-in-out";

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
        ><Menu className="h-6 w-6" /></Button>)}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-background",
          sidebarWidth,
          sidebarTransition,
          isMobile
            ? isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0",
          "border-r-[1px] border-r-[#d0d0d0] border-l-0"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn("flex items-center justify-between p-4", "border-b-[1px] border-b-[#d0d0d0]")}
          >
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 overflow-hidden"
            >
              <Shield className="h-6 w-6 text-primary flex-shrink-0" />
              <span
                className={cn(
                  "font-anta text-lg whitespace-nowrap flex-1",
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
              "flex items-center p-4 border-b", isCollapsed && !isHovering ? "justify-center" : ""

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
          <nav className="flex-1 overflow-y-auto p-2 space-y-1 border-b-[1px] border-b-[#d0d0d0]">
           <Link

              href="/dashboard"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                isActive("/dashboard")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                isCollapsed && !isHovering ? "justify-center" : ""
              )}
              onClick={handleSidebarClick}
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
              onClick={handleSidebarClick}
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
              onClick={handleSidebarClick}
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
              onClick={handleSidebarClick}
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
              onClick={handleSidebarClick}
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
              onClick={handleSidebarClick}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(isCollapsed && !isHovering ? "hidden" : "block")}
              >
                Settings
              </span>
            </Link>
          </nav>

          <div
            className={cn(
              "p-4 mt-auto", "border-t-[1px] border-t-[#d0d0d0]"
            )}
          >
            <Button
              variant="outline"
              className={cn(
                "w-full flex items-center justify-center ",
                isCollapsed && !isHovering ? "px-2" : ""
              )}
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
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
    </div>
  );
};

export default DashboardSidebar;
