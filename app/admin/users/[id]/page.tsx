"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  Smartphone,
  Receipt,
  Edit,
  Save,
} from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatCurrency } from "@/lib/utils";

interface UserType {
  _id: string;
  username: string;
  firstName: string;
  middleName: string;
  surName: string;
  role: string;
  country: string;
  stateOfOrigin: string;
  phoneNumber: string;
  address: string;
  email: string;
  emailVerified: boolean;
  subActive: boolean;
  createdAt: string;
  updatedAt: string;
  imageurl?: string;
  devicesCount: number;
  subActiveTill: string | null;
  subscriptionStatus: string;
}

interface Device {
  _id: string;
  name: string;
  IMIE1: string;
  SN: string;
  Type: string;
  status: string;
  createdAt: string;
}

interface ReceiptType {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserType | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    middleName: "",
    surName: "",
    phoneNumber: "",
    country: "",
    stateOfOrigin: "",
    address: "",
  });

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName,
        middleName: user.middleName || "",
        surName: user.surName,
        phoneNumber: user.phoneNumber,
        country: user.country,
        stateOfOrigin: user.stateOfOrigin,
        address: user.address,
      });
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // In a real app, these would be API calls
      // Example:
      // const userResponse = await fetch(`/api/admin/users/${userId}`)
      // const devicesResponse = await fetch(`/api/admin/users/${userId}/devices`)
      // const receiptsResponse = await fetch(`/api/admin/users/${userId}/receipts`)

      // Simulate API responses
      setTimeout(() => {
        // Mock user data
        const mockUser: UserType = {
          _id: userId,
          username: "Adekunlegold12",
          firstName: "Ayo",
          middleName: "Adenike",
          surName: "Adekunle",
          role: "user",
          country: "Nigeria",
          stateOfOrigin: "Lagos",
          phoneNumber: "2349038745017",
          address: "12 Marina Road, Lagos Island, Lagos",
          email: "tobi.adekunle@example.ng",
          emailVerified: true,
          subActive: true,
          createdAt: "2025-04-26T20:34:10.822Z",
          updatedAt: "2025-04-27T15:07:07.673Z",
          imageurl:
            "http://localhost:3124/usersimages/baf36f43d43f60e879765f3a83de6642.png",
          subActiveTill: "2026-04-27T14:59:06.171Z",
          devicesCount: 3,
          subscriptionStatus: "Active",
        };

        // Mock devices data
        const mockDevices: Device[] = [
          {
            _id: "680e802789096849dce94cc2",
            name: "Beta Tracker",
            IMIE1: "123456789012345",
            SN: "BT12345",
            Type: "GPS",
            status: "inactive",
            createdAt: "2025-04-27T19:06:15.227Z",
          },
          {
            _id: "680e7e64647bc518a7fa5894",
            name: "Alpha Sensor",
            IMIE1: "987654321098765",
            SN: "AS54321",
            Type: "Temperature",
            status: "inactive",
            createdAt: "2025-04-27T18:58:44.882Z",
          },
          {
            _id: "680e7a69b15a6cbd05343814",
            name: "Redmi 12C",
            IMIE1: "132137487609876",
            SN: "323843",
            Type: "mobile",
            status: "inactive",
            createdAt: "2025-04-27T18:41:45.549Z",
          },
        ];

        // Mock receipts data
        const mockReceipts: ReceiptType[] = [
          {
            _id: "680e8b18b3951f8cc7302130",
            amount: 400,
            status: "completed",
            createdAt: "2025-04-27T19:52:56.346Z",
          },
          {
            _id: "680e481b747ac30756899f0f",
            amount: 400,
            status: "completed",
            createdAt: "2025-04-27T15:07:07.416Z",
          },
          {
            _id: "680e47c13fe3e52a34a0e0a0",
            amount: 400,
            status: "completed",
            createdAt: "2025-04-27T15:05:37.347Z",
          },
        ];

        setUser(mockUser);
        setDevices(mockDevices);
        setReceipts(mockReceipts);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call
      // Example: const response = await fetch(`/api/admin/users/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editForm)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update user data
      if (user) {
        const updatedUser = {
          ...user,
          ...editForm,
        };
        setUser(updatedUser);
      }

      setIsSaving(false);
      setIsEditing(false);

      toast({
        title: "User Updated",
        description: "User information has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update user information. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (!user) return "GG";
    return `${user.firstName.charAt(0)}${user.surName.charAt(0)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-600 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "stolen":
        return "bg-red-100 text-red-600 border-red-200";
      case "missing":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading user data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The user you are looking for does not exist.
          </p>
          <Button onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/users")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit User
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                {user?.imageurl ? (
                  <AvatarImage
                    src={user.imageurl || "/placeholder.svg"}
                    alt={user?.username || "User Avatar"}
                  />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-muted-foreground">
                {user?.firstName} {user?.middleName} {user?.surName}
              </p>
              <div className="flex items-center mt-2">
                <Badge
                  variant={user?.role === "admin" ? "default" : "outline"}
                  className="mr-2"
                >
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    user?.subscriptionStatus === "Active"
                      ? "bg-green-100 text-green-600 border-green-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }
                >
                  {user?.subscriptionStatus}
                </Badge>
              </div>
              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{user?.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium">
                    {formatDate(user?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Devices:</span>
                  <span className="font-medium">{user?.devicesCount}</span>
                </div>
                {user?.subActiveTill && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subscription Until:
                    </span>
                    <span className="font-medium">
                      {formatDate(user?.subActiveTill)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {isEditing ? "Edit User Information" : "User Information"}
              </CardTitle>
              {!isEditing && (
                <CardDescription>
                  View and manage user details. Click the Edit button to make
                  changes.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surName">Surname</Label>
                      <Input
                        id="surName"
                        name="surName"
                        value={editForm.surName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        name="middleName"
                        value={editForm.middleName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={editForm.country}
                        onValueChange={(value) =>
                          handleSelectChange("country", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nigeria">Nigeria</SelectItem>
                          <SelectItem value="Ghana">Ghana</SelectItem>
                          <SelectItem value="Kenya">Kenya</SelectItem>
                          <SelectItem value="South Africa">
                            South Africa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stateOfOrigin">State</Label>
                      <Input
                        id="stateOfOrigin"
                        name="stateOfOrigin"
                        value={editForm.stateOfOrigin}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={editForm.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="devices">
                      Devices ({devices.length})
                    </TabsTrigger>
                    <TabsTrigger value="receipts">
                      Receipts ({receipts.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            First Name
                          </h3>
                          <p>{user?.firstName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Surname
                          </h3>
                          <p>{user?.surName}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Middle Name
                          </h3>
                          <p>{user?.middleName || "N/A"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Username
                          </h3>
                          <p>{user?.username}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Email
                          </h3>
                          <p>{user?.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Phone Number
                          </h3>
                          <p>{user?.phoneNumber}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Country
                          </h3>
                          <p>{user?.country}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            State
                          </h3>
                          <p>{user?.stateOfOrigin}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Address
                        </h3>
                        <p>{user?.address}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Email Verified
                          </h3>
                          <Badge
                            variant={
                              user?.emailVerified ? "default" : "destructive"
                            }
                          >
                            {user?.emailVerified ? "Verified" : "Not Verified"}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Account Created
                          </h3>
                          <p>{formatDate(user?.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="devices">
                    {devices.length > 0 ? (
                      <div className="space-y-4">
                        {devices.map((device) => (
                          <Card key={device._id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Smartphone className="h-8 w-8 text-primary mr-3" />
                                  <div>
                                    <h3 className="font-medium">
                                      {device.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {device.Type}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={getStatusColor(device.status)}
                                >
                                  {device.status.charAt(0).toUpperCase() +
                                    device.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    IMEI
                                  </p>
                                  <p className="font-mono">{device.IMIE1}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Serial Number
                                  </p>
                                  <p className="font-mono">{device.SN}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Registered
                                  </p>
                                  <p>{formatDate(device.createdAt)}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          No Devices
                        </h3>
                        <p className="text-muted-foreground">
                          This user has not registered any devices yet.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="receipts">
                    {receipts.length > 0 ? (
                      <div className="space-y-4">
                        {receipts.map((receipt) => (
                          <Card key={receipt._id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Receipt className="h-8 w-8 text-primary mr-3" />
                                  <div>
                                    <h3 className="font-medium">
                                      Receipt #{receipt._id.substring(0, 8)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(receipt.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">
                                    {formatCurrency(receipt.amount)}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className={getStatusColor(receipt.status)}
                                  >
                                    {receipt.status.charAt(0).toUpperCase() +
                                      receipt.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          No Receipts
                        </h3>
                        <p className="text-muted-foreground">
                          This user has not made any payments yet.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
