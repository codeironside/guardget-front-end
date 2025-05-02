"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import UserDashboardLayout from "@/components/user-dashboard-layout"
import { toast } from "@/hooks/use-toast"

type DeviceStatus = "not_found" | "active" | "inactive" | "stolen" | "missing" | null

interface DeviceUser {
  id: string
  username: string
  email: string
  phoneNumber?: string
  imageurl?: string
}

interface DeviceInfo {
  id: string
  name: string
  IMIE1: string
  SN: string
  Type: string
  status: string
  user: DeviceUser
  createdAt: string
  locationLost?: string
  country?: string
  state?: string
  dateLost?: string
  contactPhone?: string
}

export default function DeviceStatusPage() {
  const [imeiOrSerial, setImeiOrSerial] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(null)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)

  const handleCheck = async () => {
    if (!imeiOrSerial.trim()) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      // Example: const response = await fetch(`/api/devices/check?query=${imeiOrSerial}`)

      // Simulate API call
      setTimeout(() => {
        // Mock response based on the provided API structure
        const mockResponse = {
          status: "success",
          data: {
            id: "680e7a69b15a6cbd05343814",
            name: "Redmi 12C",
            IMIE1: "132137487609876",
            SN: "323843",
            Type: "mobile",
            status: "stolen",
            user: {
              id: "680d434222c953679fca02c2",
              username: "Adekunlegold12",
              email: "tobi.adekunle@example.ng",
              phoneNumber: "2349038745017",
              imageurl: "http://localhost:3124/usersimages/baf36f43d43f60e879765f3a83de6642.png",
            },
            createdAt: "2025-04-27T18:41:45.549Z",
            locationLost: "Shopping Mall, Lagos",
            country: "Nigeria",
            state: "Lagos",
            dateLost: "2025-04-15",
            contactPhone: "+234 800 123 4567",
          },
        }

        if (mockResponse.status === "success") {
          setDeviceInfo(mockResponse.data)
          setDeviceStatus(mockResponse.data.status as DeviceStatus)
        } else {
          setDeviceStatus("not_found")
          setDeviceInfo(null)
        }

        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error checking device status:", error)
      toast({
        title: "Error",
        description: "Failed to check device status. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-green-500 text-green-500"
      case "inactive":
        return "border-gray-500 text-gray-500"
      case "stolen":
        return "border-red-500 text-red-500"
      case "missing":
        return "border-amber-500 text-amber-500"
      default:
        return "border-gray-500 text-gray-500"
    }
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Status Checker</h1>
          <p className="text-muted-foreground">
            Check if a device has been reported as stolen or missing before making a purchase.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Check Device Status</CardTitle>
            <CardDescription>
              Enter the IMEI number for phones or Serial Number for laptops and other devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Enter IMEI or Serial Number"
                value={imeiOrSerial}
                onChange={(e) => setImeiOrSerial(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleCheck} disabled={isLoading || !imeiOrSerial.trim()} className="whitespace-nowrap">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
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
            ${deviceStatus === "active" ? "border-green-500" : ""}
          `}
          >
            <CardContent className="p-6">
              {deviceStatus === "not_found" && (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Device Not Found</h3>
                  <p className="text-muted-foreground">
                    This device is not registered in our database. This could mean it's never been registered with
                    Guardget.
                  </p>
                </div>
              )}

              {deviceStatus === "active" && deviceInfo && (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-500">Device Registered</h3>
                  <p className="text-muted-foreground mb-6">
                    This device is registered in our database and has not been reported as stolen or missing.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-1">IMEI/Serial Number</p>
                      <p className="text-sm text-muted-foreground">{deviceInfo.IMIE1 || deviceInfo.SN}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Device Name</p>
                      <p className="text-sm text-muted-foreground">{deviceInfo.name}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Device Type</p>
                      <p className="text-sm text-muted-foreground">{deviceInfo.Type}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Status</p>
                      <p className="text-sm text-green-500 font-semibold">ACTIVE</p>
                    </div>
                  </div>
                </div>
              )}

              {(deviceStatus === "stolen" || deviceStatus === "missing") && deviceInfo && (
                <div>
                  <div className="flex items-center justify-center mb-6">
                    <div
                      className={`
                      w-16 h-16 rounded-full flex items-center justify-center mr-4
                      ${deviceStatus === "stolen" ? "bg-red-100" : "bg-amber-100"}
                    `}
                    >
                      <AlertTriangle
                        className={`
                        h-8 w-8
                        ${deviceStatus === "stolen" ? "text-red-500" : "text-amber-500"}
                      `}
                      />
                    </div>
                    <h3
                      className={`
                      text-2xl font-semibold
                      ${deviceStatus === "stolen" ? "text-red-500" : "text-amber-500"}
                    `}
                    >
                      {deviceStatus === "stolen" ? "STOLEN DEVICE" : "MISSING DEVICE"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {deviceInfo.user?.imageurl && (
                        <div className="mb-6">
                          <p className="text-sm font-semibold mb-2">Owner Photo</p>
                          <div className="relative h-48 w-full rounded-lg overflow-hidden">
                            <Image
                              src={deviceInfo.user.imageurl || "/placeholder.svg"}
                              alt="Device Owner"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-1">IMEI/Serial Number</p>
                          <p className="text-sm text-muted-foreground">{deviceInfo.IMIE1 || deviceInfo.SN}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">Device Name</p>
                          <p className="text-sm text-muted-foreground">{deviceInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">Device Type</p>
                          <p className="text-sm text-muted-foreground">{deviceInfo.Type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-1">Status</p>
                        <p
                          className={`
                          text-sm font-semibold
                          ${deviceStatus === "stolen" ? "text-red-500" : "text-amber-500"}
                        `}
                        >
                          {deviceStatus === "stolen" ? "STOLEN" : "MISSING"}
                        </p>
                      </div>
                      {deviceInfo.locationLost && (
                        <div>
                          <p className="text-sm font-semibold mb-1">
                            {deviceStatus === "stolen" ? "Location Stolen" : "Location Lost"}
                          </p>
                          <p className="text-sm text-muted-foreground">{deviceInfo.locationLost}</p>
                        </div>
                      )}
                      {deviceInfo.country && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Country</p>
                          <p className="text-sm text-muted-foreground">{deviceInfo.country}</p>
                        </div>
                      )}
                      {deviceInfo.state && (
                        <div>
                          <p className="text-sm font-semibold mb-1">State</p>
                          <p className="text-sm text-muted-foreground">{deviceInfo.state}</p>
                        </div>
                      )}
                      {deviceInfo.dateLost && (
                        <div>
                          <p className="text-sm font-semibold mb-1">
                            {deviceStatus === "stolen" ? "Date Stolen" : "Date Lost"}
                          </p>
                          <p className="text-sm text-muted-foreground">{deviceInfo.dateLost}</p>
                        </div>
                      )}
                      {deviceInfo.contactPhone && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Phone Number to Call if Found</p>
                          <p className="text-sm text-primary font-semibold">{deviceInfo.contactPhone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Warning</p>
                    <p className="text-sm text-muted-foreground">
                      This device has been reported as {deviceStatus === "stolen" ? "stolen" : "missing"}. Purchasing
                      this device may be illegal and could result in legal consequences. If you have found this device,
                      please contact the owner using the phone number provided above.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </UserDashboardLayout>
  )
}
