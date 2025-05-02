"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Laptop, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function RegisterDevicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deviceType, setDeviceType] = useState("phone");

  const [phoneForm, setPhoneForm] = useState({
    name: "",
    IMIE1: "",
    IMEI2: "",
    SN: "",
    Type: "Phone",
    status: "active",
  });

  const [laptopForm, setLaptopForm] = useState({
    name: "",
    SN: "",
    Type: "Laptop",
    status: "active",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPhoneForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLaptopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLaptopForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = deviceType === "phone" ? phoneForm : laptopForm;

    // Validate form
    if (
      deviceType === "phone" &&
      (!formData.name || !formData.IMIE1 || !formData.SN)
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (deviceType === "laptop" && (!formData.name || !formData.SN)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would be an API call
      // Simulate API call
      setTimeout(() => {
        // Save to local storage for demo purposes
        const existingDevices = localStorage.getItem("userDevices");
        const devices = existingDevices ? JSON.parse(existingDevices) : [];
        devices.push(formData);
        localStorage.setItem("userDevices", JSON.stringify(devices));

        setIsLoading(false);

        toast({
          title: "Device Registered",
          description: "Your device has been successfully registered",
        });

        // Redirect to devices page
        router.push("/dashboard/devices");
      }, 1500);
    } catch (error) {
      console.error("Error registering device:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register device. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/dashboard/devices" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold">Register New Device</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>
              Enter your device details to register it with Guardget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="phone" onValueChange={setDeviceType}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Phone</span>
                </TabsTrigger>
                <TabsTrigger value="laptop" className="flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  <span>Laptop</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Device Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. iPhone 13 Pro"
                        value={phoneForm.name}
                        onChange={handlePhoneChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Type">Device Type</Label>
                      <Select
                        value={phoneForm.Type}
                        onValueChange={(value) =>
                          setPhoneForm((prev) => ({ ...prev, Type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Phone">Phone</SelectItem>
                          <SelectItem value="Tablet">Tablet</SelectItem>
                          <SelectItem value="RFID">RFID</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="IMIE1">IMEI 1 *</Label>
                      <Input
                        id="IMIE1"
                        name="IMIE1"
                        placeholder="e.g. 123456789012345"
                        value={phoneForm.IMIE1}
                        onChange={handlePhoneChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Dial *#06# on your phone to find your IMEI number
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="IMEI2">IMEI 2 (if available)</Label>
                      <Input
                        id="IMEI2"
                        name="IMEI2"
                        placeholder="e.g. 123456789012345"
                        value={phoneForm.IMEI2}
                        onChange={handlePhoneChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="SN">Serial Number *</Label>
                      <Input
                        id="SN"
                        name="SN"
                        placeholder="e.g. C02G30LFMD6M"
                        value={phoneForm.SN}
                        onChange={handlePhoneChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Found in Settings &gt; General &gt; About on most
                        devices
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Registering...
                      </span>
                    ) : (
                      "Register Device"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="laptop">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Device Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. MacBook Pro"
                        value={laptopForm.name}
                        onChange={handleLaptopChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Type">Device Type</Label>
                      <Select
                        value={laptopForm.Type}
                        onValueChange={(value) =>
                          setLaptopForm((prev) => ({ ...prev, Type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laptop">Laptop</SelectItem>
                          <SelectItem value="Desktop">Desktop</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="SN">Serial Number *</Label>
                      <Input
                        id="SN"
                        name="SN"
                        placeholder="e.g. C02G30LFMD6M"
                        value={laptopForm.SN}
                        onChange={handleLaptopChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Found on the bottom of your laptop or in System
                        Information
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Registering...
                      </span>
                    ) : (
                      "Register Device"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
