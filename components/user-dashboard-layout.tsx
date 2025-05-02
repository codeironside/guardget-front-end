"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "./dashboard-sidebar";

import { useAuth } from "./context/auth-content";




type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function UserDashboardLayout({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, session } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }

    // Initialize sidebar state from localStorage
    const savedState = localStorage.getItem("sidebarState");
    if (savedState) {
      setSidebarOpen(savedState === "open");
    } else {
      // Default to open on desktop, closed on mobile
      setSidebarOpen(window.innerWidth >= 768);
    }

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user, loading, router]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarState", sidebarOpen ? "open" : "closed");
  }, [sidebarOpen]);

  const getInitials = () => {
    if (!user) return "GG";
    return `${user.firstName.charAt(0)}${user.surName.charAt(0)}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-6 p-8 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-emerald-500 animate-pulse"></div>
            </div>
            <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mx-auto" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Loading Guardget
          </h2>

          <p className="text-slate-600 dark:text-slate-400">
            Please wait while we prepare your secure environment...
          </p>

          <div className="flex justify-center space-x-1 pt-2">
            <div
              className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
           
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
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
            
            </div>
          </div>
          <div className="space-y-6">
            {!user.subActive &&
          pathname !== "/dashboard" &&
          pathname !== "/dashboard/subscription" ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Subscription Required</AlertTitle>
                <AlertDescription>
                  You need an active subscription to access this feature. Please
                  subscribe to continue.
                </AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Link href="/dashboard/subscription" >
                  <Button>View Subscription Plans</Button>
                </Link>
              </div>
            </div>
          ) : (children)}
        </div>
      </main>
      
    </div>
  );
}
