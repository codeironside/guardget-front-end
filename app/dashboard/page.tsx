"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  PlusCircle,
  Shield,
  Smartphone,
  User,
  Bell,
  Calendar,
  MapPin,
} from "lucide-react";
import UserDashboardLayout from "@/components/user-dashboard-layout";
import { motion } from "framer-motion";
import { useAuth } from "@/components/context/auth-content";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    active: 0,
    missing: 0,
    stolen: 0,
  });
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "device_registered",
      device: "iPhone 13 Pro",
      date: "2023-05-15T10:30:00Z",
    },
    {
      id: 2,
      type: "subscription_renewed",
      plan: "Premium",
      date: "2023-05-10T14:45:00Z",
    },
    {
      id: 3,
      type: "device_reported",
      device: "Samsung Galaxy S22",
      status: "missing",
      date: "2023-05-05T09:15:00Z",
    },
  ]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      // In a real app, this would be an API call
      const storedDevices = localStorage.getItem("userDevices");
      if (storedDevices) {
        const devices = JSON.parse(storedDevices);
        const stats = {
          total: devices.length,
          active: devices.filter((d: any) => d.status === "active").length,
          missing: devices.filter((d: any) => d.status === "missing").length,
          stolen: devices.filter((d: any) => d.status === "stolen").length,
        };
        setDeviceStats(stats);
      }
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "device_registered":
        return <Smartphone className="h-4 w-4 text-green-500" />;
      case "subscription_renewed":
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case "device_reported":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case "device_registered":
        return `Registered new device: ${activity.device}`;
      case "subscription_renewed":
        return `Renewed ${activity.plan} subscription`;
      case "device_reported":
        return `Reported ${activity.device} as ${activity.status}`;
      default:
        return "Unknown activity";
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <UserDashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="h-10 w-[250px] bg-muted animate-pulse rounded-md"></div>
            <div className="h-4 w-[300px] bg-muted animate-pulse rounded-md"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[100px] bg-muted animate-pulse rounded-md"
              ></div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
            </div>
            <div>
              <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.userDetails?.firstName || "User"}! Here's an
            overview of your account.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Devices
                    </p>
                    <h3 className="text-2xl font-bold">{deviceStats.total}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/devices">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start p-0 h-auto"
                    >
                      <span className="text-xs text-muted-foreground flex items-center">
                        View all devices{" "}
                        <CheckCircle className="ml-1 h-3 w-3" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Devices
                    </p>
                    <h3 className="text-2xl font-bold">{deviceStats.active}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress
                    value={(deviceStats.active / deviceStats.total) * 100 || 0}
                    className="h-1"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round(
                      (deviceStats.active / deviceStats.total) * 100
                    ) || 0}
                    % of devices are protected
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Missing Devices
                    </p>
                    <h3 className="text-2xl font-bold">
                      {deviceStats.missing}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/devices">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start p-0 h-auto"
                    >
                      <span className="text-xs text-muted-foreground flex items-center">
                        View missing devices{" "}
                        <AlertTriangle className="ml-1 h-3 w-3" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Subscription
                    </p>
                    <h3 className="text-2xl font-bold">
                      {user?.userDetails?.subActive ? "Active" : "Inactive"}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/subscription">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start p-0 h-auto"
                    >
                      <span className="text-xs text-muted-foreground flex items-center">
                        {user?.userDetails?.subActive
                          ? "View details"
                          : "Subscribe now"}{" "}
                        <CreditCard className="ml-1 h-3 w-3" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Device Status Overview</CardTitle>
                <CardDescription>
                  Monitor the status of all your registered devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Device Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm">Active</span>
                              </div>
                              <span className="text-sm font-medium">
                                {deviceStats.active}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                                <span className="text-sm">Missing</span>
                              </div>
                              <span className="text-sm font-medium">
                                {deviceStats.missing}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                                <span className="text-sm">Stolen</span>
                              </div>
                              <span className="text-sm font-medium">
                                {deviceStats.stolen}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Device Types
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Smartphone className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm">Phones</span>
                              </div>
                              <span className="text-sm font-medium">2</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Laptop className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm">Laptops</span>
                              </div>
                              <span className="text-sm font-medium">1</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Watch className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm">Wearables</span>
                              </div>
                              <span className="text-sm font-medium">0</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Recent Locations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">Lagos, Nigeria</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              2 devices
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">Home Office</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              1 device
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="activity">
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 pb-4 border-b"
                        >
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              {getActivityText(activity)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(activity.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/devices">
                  <Button variant="outline" size="sm">
                    View All Devices
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/dashboard/devices/register">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register New Device
                  </Button>
                </Link>
                <Link href="/dashboard/device-status">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Check Device Status
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </Link>
                <Link href="/dashboard/receipts">
                  <Button variant="outline" className="w-full justify-start">
                    <Receipt className="mr-2 h-4 w-4" />
                    View Receipts
                  </Button>
                </Link>

                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Subscription Status
                        </p>
                        <div className="flex items-center mt-1">
                          {user?.userDetails?.subActive ? (
                            <>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Active
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-2">
                                Expires in 30 days
                              </span>
                            </>
                          ) : (
                            <>
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200"
                              >
                                Inactive
                              </Badge>
                              <Link
                                href="/dashboard/subscription"
                                className="text-xs text-primary ml-2"
                              >
                                Subscribe now
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}

// Add missing Laptop and Watch components
function Laptop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" ry="2"></rect>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>
  );
}

function Watch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="6"></circle>
      <polyline points="12 10 12 12 13 13"></polyline>
      <path d="M16.2 16.2 15 20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2l-1.2-3.8"></path>
      <path d="M7.8 7.8 9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2l1.2 3.8"></path>
    </svg>
  );
}

function Receipt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
      <path d="M12 17.5v-11"></path>
    </svg>
  );
}
