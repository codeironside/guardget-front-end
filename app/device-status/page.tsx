"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, AlertTriangle, CheckCircle } from "lucide-react";
import Image from "next/image";

type DeviceStatus = "not_found" | "registered" | "stolen" | "missing" | null;

interface DeviceInfo {
  imeiOrSerial: string;
  ownerPhoto?: string;
  deviceName?: string;
  deviceModel?: string;
  status?: "stolen" | "missing";
  locationLost?: string;
  country?: string;
  state?: string;
  dateLost?: string;
  contactPhone?: string;
}

export default function DeviceStatusPage() {
  const [imeiOrSerial, setImeiOrSerial] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  const handleCheck = async () => {
    if (!imeiOrSerial.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock response - in a real app, this would come from your API
      const mockStatus: DeviceStatus = [
        "not_found",
        "registered",
        "stolen",
        "missing",
      ][Math.floor(Math.random() * 4)];

      let mockDeviceInfo: DeviceInfo | null = null;

      if (mockStatus !== "not_found") {
        mockDeviceInfo = {
          imeiOrSerial: imeiOrSerial,
          ownerPhoto:
            mockStatus !== "registered"
              ? "/placeholder.svg?height=200&width=200"
              : undefined,
          deviceName: "iPhone 13 Pro",
          deviceModel: "A2483",
          status:
            mockStatus === "stolen"
              ? "stolen"
              : mockStatus === "missing"
              ? "missing"
              : undefined,
          locationLost:
            mockStatus === "stolen" || mockStatus === "missing"
              ? "Shopping Mall"
              : undefined,
          country:
            mockStatus === "stolen" || mockStatus === "missing"
              ? "Nigeria"
              : undefined,
          state:
            mockStatus === "stolen" || mockStatus === "missing"
              ? "Lagos"
              : undefined,
          dateLost:
            mockStatus === "stolen" || mockStatus === "missing"
              ? "15/04/2023"
              : undefined,
          contactPhone:
            mockStatus === "stolen" || mockStatus === "missing"
              ? "+234 800 123 4567"
              : undefined,
        };
      }

      setDeviceStatus(mockStatus);
      setDeviceInfo(mockDeviceInfo);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-4">Device Status Checker</h1>
          <p className="text-muted-foreground">
            Check if a device has been reported as stolen or missing before
            making a purchase. Enter the IMEI number for phones or Serial Number
            for laptops.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Enter IMEI or Serial Number"
                value={imeiOrSerial}
                onChange={(e) => setImeiOrSerial(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCheck}
                disabled={isLoading || !imeiOrSerial.trim()}
                className="whitespace-nowrap"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Checking...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Check Status
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {deviceStatus && (
          <Card
            className={`
            ${deviceStatus === "stolen" ? "border-red-500" : ""}
            ${deviceStatus === "missing" ? "border-amber-500" : ""}
            ${deviceStatus === "registered" ? "border-green-500" : ""}
          `}
          >
            <CardContent className="p-6">
              {deviceStatus === "not_found" && (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Device Not Found
                  </h3>
                  <p className="text-muted-foreground">
                    This device is not registered in our database. This could
                    mean it's never been registered with Guardget.
                  </p>
                </div>
              )}

              {deviceStatus === "registered" && deviceInfo && (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-500">
                    Device Registered
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    This device is registered in our database and has not been
                    reported as stolen or missing.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-1">
                        IMEI/Serial Number
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {deviceInfo.imeiOrSerial}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Device Name</p>
                      <p className="text-sm text-muted-foreground">
                        {deviceInfo.deviceName}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Device Model</p>
                      <p className="text-sm text-muted-foreground">
                        {deviceInfo.deviceModel}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Status</p>
                      <p className="text-sm text-green-500 font-semibold">
                        REGISTERED
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(deviceStatus === "stolen" || deviceStatus === "missing") &&
                deviceInfo && (
                  <div>
                    <div className="flex items-center justify-center mb-6">
                      <div
                        className={`
                      w-16 h-16 rounded-full flex items-center justify-center mr-4
                      ${
                        deviceStatus === "stolen"
                          ? "bg-red-100"
                          : "bg-amber-100"
                      }
                    `}
                      >
                        <AlertTriangle
                          className={`
                        h-8 w-8
                        ${
                          deviceStatus === "stolen"
                            ? "text-red-500"
                            : "text-amber-500"
                        }
                      `}
                        />
                      </div>
                      <h3
                        className={`
                      text-2xl font-semibold
                      ${
                        deviceStatus === "stolen"
                          ? "text-red-500"
                          : "text-amber-500"
                      }
                    `}
                      >
                        {deviceStatus === "stolen"
                          ? "STOLEN DEVICE"
                          : "MISSING DEVICE"}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        {deviceInfo.ownerPhoto && (
                          <div className="mb-6">
                            <p className="text-sm font-semibold mb-2">
                              Owner Photo
                            </p>
                            <div className="relative h-48 w-full rounded-lg overflow-hidden">
                              <Image
                                src={
                                  deviceInfo.ownerPhoto || "/placeholder.svg"
                                }
                                alt="Device Owner"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold mb-1">
                              IMEI/Serial Number
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {deviceInfo.imeiOrSerial}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1">
                              Device Name
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {deviceInfo.deviceName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1">
                              Device Model
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {deviceInfo.deviceModel}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-1">Status</p>
                          <p
                            className={`
                          text-sm font-semibold
                          ${
                            deviceStatus === "stolen"
                              ? "text-red-500"
                              : "text-amber-500"
                          }
                        `}
                          >
                            {deviceStatus === "stolen" ? "STOLEN" : "MISSING"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">
                            {deviceStatus === "stolen"
                              ? "Location Stolen"
                              : "Location Lost"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {deviceInfo.locationLost}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">Country</p>
                          <p className="text-sm text-muted-foreground">
                            {deviceInfo.country}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">State</p>
                          <p className="text-sm text-muted-foreground">
                            {deviceInfo.state}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">
                            {deviceStatus === "stolen"
                              ? "Date Stolen"
                              : "Date Lost"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {deviceInfo.dateLost}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">
                            Phone Number to Call if Found
                          </p>
                          <p className="text-sm text-primary font-semibold">
                            {deviceInfo.contactPhone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-2">Warning</p>
                      <p className="text-sm text-muted-foreground">
                        This device has been reported as{" "}
                        {deviceStatus === "stolen" ? "stolen" : "missing"}.
                        Purchasing this device may be illegal and could result
                        in legal consequences. If you have found this device,
                        please contact the owner using the phone number provided
                        above.
                      </p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
