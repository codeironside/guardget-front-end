"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const isMobile = useMobile();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to verify the token
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          // Redirect to login if not authenticated
          router.push("/auth/login");
          return;
        }

        // Parse user data
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Simulate fetching user dashboard data
        // In a real app, this would be an API call
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive",
        });
        router.push("/auth/login");
      }
    };

    checkAuth();

    // Initialize sidebar state
    if (!isMobile) {
      const savedState = localStorage.getItem("sidebarCollapsed");
      setIsSidebarCollapsed(savedState === "true");
    }
  }, [router, isMobile]);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // Redirect to login
    router.push("/auth/login");

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isMobile ? "ml-0" : isSidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Header */}
        <DashboardHeader
          user={user}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background/50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
