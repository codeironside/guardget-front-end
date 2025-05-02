"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, AlertTriangle } from "lucide-react";
import DeviceCard from "@/components/device-card";
import UserDashboardLayout from "@/components/user-dashboard-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { deviceService } from "@/lib/api-service";

interface Device {
  id?: string;
  name: string;
  Type: string;
  IMIE1?: string;
  IMEI2?: string;
  SN: string;
  status: "active" | "stolen" | "missing";
  dateAdded?: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get devices from API
        try {
          const response = await deviceService.getUserDevices();
          if (response.status === "success" && Array.isArray(response.data)) {
            setDevices(response.data);
            setFilteredDevices(response.data);
            return;
          }
        } catch (apiError) {
          console.error("API error:", apiError);
          // Fall back to local storage if API fails
        }

        // Fallback to localStorage for demo purposes
        const storedDevices = localStorage.getItem("userDevices");
        if (storedDevices) {
          const parsedDevices = JSON.parse(storedDevices);
          setDevices(parsedDevices);
          setFilteredDevices(parsedDevices);
        } else {
          // If no devices in localStorage, use mock data
          const mockDevices = [
            {
              name: "iPhone 13 Pro",
              Type: "Phone",
              IMIE1: "123456789012345",
              IMEI2: "543210987654321",
              SN: "ABCD1234EFGH5678",
              status: "active",
              dateAdded: "2023-01-15",
              batteryLevel: 85,
              lastSeen: "Today, 3:45 PM",
              location: "Lagos, Nigeria",
            },
            {
              name: "MacBook Pro",
              Type: "Laptop",
              SN: "C02G5KYTQ6L2",
              status: "active",
              dateAdded: "2022-11-20",
              batteryLevel: 65,
              lastSeen: "Yesterday, 8:30 PM",
              location: "Home Office",
            },
            {
              name: "Samsung Galaxy S22",
              Type: "Phone",
              IMIE1: "987654321098765",
              SN: "R9XW10ABCD",
              status: "missing",
              dateAdded: "2023-03-05",
              batteryLevel: 12,
              lastSeen: "3 days ago, 10:15 AM",
              location: "Ikeja, Lagos",
            },
          ];
          setDevices(mockDevices);
          setFilteredDevices(mockDevices);
          localStorage.setItem("userDevices", JSON.stringify(mockDevices));
        }
      } catch (err) {
        console.error("Error fetching devices:", err);
        setError("Failed to load devices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDevices(devices);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = devices.filter(
        (device) =>
          device.name.toLowerCase().includes(query) ||
          device.Type.toLowerCase().includes(query) ||
          device.SN.toLowerCase().includes(query) ||
          (device.IMIE1 && device.IMIE1.toLowerCase().includes(query)) ||
          (device.IMEI2 && device.IMEI2.toLowerCase().includes(query))
      );
      setFilteredDevices(filtered);
    }
  }, [searchQuery, devices]);

  const getDevicesByStatus = (status: string) => {
    return filteredDevices.filter((device) => device.status === status);
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

          <div className="h-12 w-full bg-muted animate-pulse rounded-md"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[200px] bg-muted animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your registered devices
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search devices..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/dashboard/devices/register">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Register New Device
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="all">
              All ({filteredDevices.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({getDevicesByStatus("active").length})
            </TabsTrigger>
            <TabsTrigger value="missing">
              Missing ({getDevicesByStatus("missing").length})
            </TabsTrigger>
            <TabsTrigger value="stolen">
              Stolen ({getDevicesByStatus("stolen").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredDevices.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No devices found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No devices match your search query"
                    : "You haven't registered any devices yet"}
                </p>
                <Link href="/dashboard/devices/register">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register New Device
                  </Button>
                </Link>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredDevices.map((device, index) => (
                  <motion.div key={device.SN + index} variants={item}>
                    <DeviceCard device={device} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {getDevicesByStatus("active").length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No active devices found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No active devices match your search query"
                    : "You don't have any active devices"}
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {getDevicesByStatus("active").map((device, index) => (
                  <motion.div key={device.SN + index} variants={item}>
                    <DeviceCard device={device} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="missing">
            {getDevicesByStatus("missing").length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No missing devices found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No missing devices match your search query"
                    : "You don't have any missing devices reported"}
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {getDevicesByStatus("missing").map((device, index) => (
                  <motion.div key={device.SN + index} variants={item}>
                    <DeviceCard device={device} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="stolen">
            {getDevicesByStatus("stolen").length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No stolen devices found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No stolen devices match your search query"
                    : "You don't have any stolen devices reported"}
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {getDevicesByStatus("stolen").map((device, index) => (
                  <motion.div key={device.SN + index} variants={item}>
                    <DeviceCard device={device} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </UserDashboardLayout>
  );
}
