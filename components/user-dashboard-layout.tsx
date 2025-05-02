"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Home,
  Smartphone,
  Receipt,
  Settings,
  Search,
  LogOut,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/auth-content";
import { ModeToggle } from "./mode-toggle";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function UserDashboardLayout({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
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
    console.log(`user details ${JSON.stringify(user)}`)
    if (!user) return "GG";
    return `${user.firstName.charAt(
      0
    )}${user.surName.charAt(0)}`;
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
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar variant="floating" collapsible="icon">
          <SidebarHeader className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 px-2">
              <Avatar>
                <AvatarImage src={user.imageurl || ""} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm truncate max-w-[120px]">
                  {user.firstName} {user.surName}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard/devices")}
                  tooltip="My Devices"
                >
                  <Link href="/dashboard/devices">
                    <Smartphone className="h-5 w-5" />
                    <span>My Devices</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/device-status"}
                  tooltip="Device Status"
                >
                  <Link href="/dashboard/device-status">
                    <Search className="h-5 w-5" />
                    <span>Device Status</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/subscription"}
                  tooltip="Subscription"
                >
                  <Link href="/dashboard/subscription">
                    <CreditCard className="h-5 w-5" />
                    <span>Subscription</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/receipts"}
                  tooltip="Receipts"
                >
                  <Link href="/dashboard/receipts">
                    <Receipt className="h-5 w-5" />
                    <span>Receipts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/settings"}
                  tooltip="Settings"
                >
                  <Link href="/dashboard/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout" onClick={logout}>
                  <button>
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex h-16 items-center px-4 md:px-6">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                <ModeToggle />
                <Avatar>
                  <AvatarImage src={user.imageurl || ""} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-6">
            {!user.subActive &&
            pathname !== "/dashboard" &&
            pathname !== "/dashboard/subscription" ? (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Subscription Required</AlertTitle>
                  <AlertDescription>
                    You need an active subscription to access this feature.
                    Please subscribe to continue.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link href="/dashboard/subscription">
                      View Subscription Plans
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
