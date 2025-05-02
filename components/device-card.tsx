"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Laptop,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Battery,
  Wifi,
  Signal,
  Lock,
  Unlock,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface Device {
  id?: string;
  name: string;
  Type: string;
  IMIE1?: string;
  IMEI2?: string;
  SN: string;
  status: "active" | "stolen" | "missing";
  dateAdded?: string;
  lastSeen?: string;
  batteryLevel?: number;
  location?: string;
}

interface DeviceCardProps {
  device: Device;
}

const DeviceCard = ({ device }: DeviceCardProps) => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<"stolen" | "missing">("stolen");
  const [reportDetails, setReportDetails] = useState({
    location: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [transferDetails, setTransferDetails] = useState({
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Mock data for the interactive device display
  const batteryLevel = device.batteryLevel || Math.floor(Math.random() * 100);
  const lastSeen = device.lastSeen || "Today, 2:45 PM";
  const location = device.location || "Unknown";

  const handleReportSubmit = () => {
    if (!reportDetails.location) {
      toast({
        title: "Error",
        description:
          "Please provide the location where the device was lost/stolen",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      // Update device status in local storage
      const userDevices = localStorage.getItem("userDevices");
      if (userDevices) {
        const devices = JSON.parse(userDevices);
        const updatedDevices = devices.map((d: Device) => {
          if (d.name === device.name && d.SN === device.SN) {
            return { ...d, status: reportType };
          }
          return d;
        });
        localStorage.setItem("userDevices", JSON.stringify(updatedDevices));
      }

      setIsLoading(false);
      setIsReportDialogOpen(false);

      toast({
        title: "Report Submitted",
        description: `Your device has been reported as ${reportType}`,
      });

      // Force refresh
      window.location.reload();
    }, 1500);
  };

  const handleTransferSubmit = () => {
    if (!transferDetails.email && !transferDetails.phone) {
      toast({
        title: "Error",
        description:
          "Please provide either email or phone number of the new owner",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      setIsLoading(false);
      setIsTransferDialogOpen(false);

      toast({
        title: "Transfer Initiated",
        description:
          "Ownership transfer request has been sent to the new owner",
      });
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-green-500 text-green-500";
      case "stolen":
        return "border-red-500 text-red-500";
      case "missing":
        return "border-amber-500 text-amber-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10";
      case "stolen":
        return "bg-red-500/10";
      case "missing":
        return "bg-amber-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`device-card ${
          device.status !== "active" ? device.status : ""
        }`}
      >
        <Card className="overflow-hidden">
          <div className={`p-2 ${getStatusBgColor(device.status)}`}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-black/20 dark:bg-white/20"></div>
                <div className="text-xs font-medium">Guardget</div>
              </div>
              <div className="flex items-center gap-1">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <Battery className="h-3 w-3" />
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            <Tabs
              defaultValue="details"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 rounded-none bg-muted/50">
                <TabsTrigger value="details" className="text-xs py-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="status" className="text-xs py-1">
                  Status
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-xs py-1">
                  Actions
                </TabsTrigger>
              </TabsList>

              <div className="p-4">
                <TabsContent value="details" className="mt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        {device.Type.toLowerCase().includes("phone") ||
                        device.Type === "RFID" ? (
                          <Smartphone className="h-5 w-5 text-primary" />
                        ) : (
                          <Laptop className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{device.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {device.Type}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(device.status)}`}
                    >
                      {device.status.charAt(0).toUpperCase() +
                        device.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    {device.IMIE1 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IMEI 1:</span>
                        <span className="font-mono">{device.IMIE1}</span>
                      </div>
                    )}
                    {device.IMEI2 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IMEI 2:</span>
                        <span className="font-mono">{device.IMEI2}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Serial Number:
                      </span>
                      <span className="font-mono">{device.SN}</span>
                    </div>
                    {device.dateAdded && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Date Added:
                        </span>
                        <span>{device.dateAdded}</span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="status" className="mt-0 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Battery</span>
                      <span className="text-xs">{batteryLevel}%</span>
                    </div>
                    <Progress value={batteryLevel} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Last Seen
                        </p>
                        <p className="text-sm font-medium">{lastSeen}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Location
                        </p>
                        <p className="text-sm font-medium">{location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {device.status === "active" ? (
                        <Lock className="h-4 w-4 text-green-500" />
                      ) : (
                        <Unlock className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Security Status
                        </p>
                        <p className="text-sm font-medium">
                          {device.status === "active"
                            ? "Protected"
                            : "Alert Active"}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="mt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {device.status === "active" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex flex-col items-center justify-center h-20 text-xs"
                          onClick={() => {
                            setReportType("missing");
                            setIsReportDialogOpen(true);
                          }}
                        >
                          <AlertTriangle className="h-6 w-6 mb-1 text-amber-500" />
                          Report Missing
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex flex-col items-center justify-center h-20 text-xs"
                          onClick={() => {
                            setReportType("stolen");
                            setIsReportDialogOpen(true);
                          }}
                        >
                          <AlertTriangle className="h-6 w-6 mb-1 text-red-500" />
                          Report Stolen
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex flex-col items-center justify-center h-20 text-xs"
                          onClick={() => setIsTransferDialogOpen(true)}
                        >
                          <UserPlus className="h-6 w-6 mb-1" />
                          Transfer Ownership
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex flex-col items-center justify-center h-20 text-xs"
                        >
                          <Shield className="h-6 w-6 mb-1 text-primary" />
                          View Details
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex flex-col items-center justify-center h-20 text-xs"
                        >
                          <CheckCircle className="h-6 w-6 mb-1 text-green-500" />
                          Mark as Recovered
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex flex-col items-center justify-center h-20 text-xs"
                        >
                          <Shield className="h-6 w-6 mb-1 text-primary" />
                          View Details
                        </Button>
                      </>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Report Device as {reportType === "stolen" ? "Stolen" : "Missing"}
            </DialogTitle>
            <DialogDescription>
              Please provide details about when and where your device was{" "}
              {reportType === "stolen" ? "stolen" : "lost"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g. Shopping Mall, Lagos"
                value={reportDetails.location}
                onChange={(e) =>
                  setReportDetails({
                    ...reportDetails,
                    location: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={reportDetails.date}
                onChange={(e) =>
                  setReportDetails({ ...reportDetails, date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                placeholder="Provide any additional details that might help identify your device"
                value={reportDetails.description}
                onChange={(e) =>
                  setReportDetails({
                    ...reportDetails,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReportSubmit} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Report"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Ownership Dialog */}
      <Dialog
        open={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Device Ownership</DialogTitle>
            <DialogDescription>
              Enter the details of the new owner. They must have a Guardget
              account to complete the transfer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. newowner@example.com"
                value={transferDetails.email}
                onChange={(e) =>
                  setTransferDetails({
                    ...transferDetails,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g. +234 800 123 4567"
                value={transferDetails.phone}
                onChange={(e) =>
                  setTransferDetails({
                    ...transferDetails,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <p className="text-sm text-muted-foreground">
              The new owner will receive a notification to accept the transfer.
              You will still own the device until they accept.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTransferDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleTransferSubmit} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Transfer Ownership"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeviceCard;
