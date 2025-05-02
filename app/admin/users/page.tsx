"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Loader2,
  Filter,
} from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
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

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    username: "",
    firstName: "",
    middleName: "",
    surName: "",
    email: "",
    phoneNumber: "",
    country: "Nigeria",
    stateOfOrigin: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, statusFilter]);

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Example: const response = await fetch(`/api/admin/users?page=${page}&limit=10`)

      // Simulate API response
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            _id: "680a3bf749c6275a46b21d07",
            username: "ayo_adenike92",
            firstName: "Ayo",
            middleName: "Adenike",
            surName: "Adekunle",
            role: "user",
            country: "Nigeria",
            stateOfOrigin: "Lagos",
            phoneNumber: "+2347061234567",
            address: "12 Marina Road, Lagos Island, Lagos",
            email: "ayo.adekunle@example.ng",
            emailVerified: false,
            subActive: false,
            createdAt: "2025-04-24T13:26:15.196Z",
            updatedAt: "2025-04-24T13:26:15.196Z",
            devicesCount: 0,
            subActiveTill: null,
            subscriptionStatus: "Inactive",
          },
          {
            _id: "680d434222c953679fca02c2",
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
            devicesCount: 0,
            subscriptionStatus: "Active",
          },
          {
            _id: "680e8919db341ca6b1d159aa",
            username: "Angelgold12",
            firstName: "Ayo",
            middleName: "Adenike",
            surName: "Adekunle",
            role: "user",
            country: "Nigeria",
            stateOfOrigin: "Lagos",
            phoneNumber: "2349067455212",
            address: "12 Marina Road, Lagos Island, Lagos",
            email: "angel.adekunle@example.ng",
            emailVerified: true,
            subActive: true,
            createdAt: "2025-04-27T19:44:25.804Z",
            updatedAt: "2025-04-27T19:52:56.633Z",
            subActiveTill: "2025-08-27T19:52:56.627Z",
            devicesCount: 3,
            subscriptionStatus: "Active",
          },
          {
            _id: "680e9ba78cfdea1829ff9bc1",
            username: "AYOadmin.user",
            firstName: "tobi",
            middleName: "Adenike",
            surName: "Adekunle",
            role: "admin",
            country: "Nigeria",
            stateOfOrigin: "Lagos",
            phoneNumber: "2348134481508",
            address: "12 Marina Road, Lagos Island, Lagos",
            email: "ayo.admin@example.ng",
            emailVerified: true,
            subActive: false,
            createdAt: "2025-04-27T21:03:35.873Z",
            updatedAt: "2025-04-27T21:03:35.873Z",
            devicesCount: 0,
            subActiveTill: null,
            subscriptionStatus: "Inactive",
          },
        ];

        const mockPagination: PaginationInfo = {
          total: 4,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        setUsers(mockUsers);
        setPagination(mockPagination);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          `${user.firstName} ${user.surName}`.toLowerCase().includes(query) ||
          user.phoneNumber.includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter(
          (user) => user.subscriptionStatus === "Active"
        );
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter(
          (user) => user.subscriptionStatus === "Inactive"
        );
      } else if (statusFilter === "admin") {
        filtered = filtered.filter((user) => user.role === "admin");
      } else if (statusFilter === "user") {
        filtered = filtered.filter((user) => user.role === "user");
      }
    }

    setFilteredUsers(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterUsers();
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (newAdminForm.password !== newAdminForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password do not match",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // In a real app, this would be an API call
      // Example: const response = await fetch('/api/admin/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...newAdminForm, role: 'admin' })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add the new admin to the list
      const newAdmin: User = {
        _id: `new_${Date.now()}`,
        username: newAdminForm.username,
        firstName: newAdminForm.firstName,
        middleName: newAdminForm.middleName,
        surName: newAdminForm.surName,
        role: "admin",
        country: newAdminForm.country,
        stateOfOrigin: newAdminForm.stateOfOrigin,
        phoneNumber: newAdminForm.phoneNumber,
        address: newAdminForm.address,
        email: newAdminForm.email,
        emailVerified: true,
        subActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        devicesCount: 0,
        subActiveTill: null,
        subscriptionStatus: "Inactive",
      };

      setUsers([newAdmin, ...users]);
      setIsCreating(false);
      setIsCreateDialogOpen(false);

      // Reset form
      setNewAdminForm({
        username: "",
        firstName: "",
        middleName: "",
        surName: "",
        email: "",
        phoneNumber: "",
        country: "Nigeria",
        stateOfOrigin: "",
        address: "",
        password: "",
        confirmPassword: "",
      });

      toast({
        title: "Admin Created",
        description: "New admin user has been created successfully",
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      toast({
        title: "Error",
        description: "Failed to create admin user. Please try again.",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const getInitials = (firstName: string, surName: string) => {
    return `${firstName.charAt(0)}${surName.charAt(0)}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Users Management
            </h1>
            <p className="text-muted-foreground">
              Manage all users and administrators in the system.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Admin
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Total {pagination.total} users, showing page {pagination.page}{" "}
                  of {pagination.totalPages}
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full md:w-64"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Users
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("inactive")}
                    >
                      Inactive Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("admin")}>
                      Admins Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("user")}>
                      Regular Users Only
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="admin">Admins</TabsTrigger>
              </TabsList>

              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">
                          User
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Phone
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Subscription
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Devices
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                {user.imageurl ? (
                                  <AvatarImage
                                    src={user.imageurl || "/placeholder.svg"}
                                    alt={user.username}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {getInitials(user.firstName, user.surName)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {user.username}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {user.firstName} {user.surName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.phoneNumber}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "outline"
                              }
                            >
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={
                                user.subscriptionStatus === "Active"
                                  ? "bg-green-100 text-green-600 border-green-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }
                            >
                              {user.subscriptionStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{user.devicesCount}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/users/${user._id}`}>
                                  View
                                </Link>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/admin/users/${user._id}/edit`}
                                    >
                                      Edit User
                                    </Link>
                                  </DropdownMenuItem>
                                  {user.role !== "admin" && (
                                    <DropdownMenuItem>
                                      Make Admin
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      No users found matching your criteria.
                    </p>
                  </div>
                )}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUsers(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUsers(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Create Admin Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Admin User</DialogTitle>
              <DialogDescription>
                Create a new administrator account. Admins have full access to
                the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAdmin}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={newAdminForm.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surName">Surname</Label>
                    <Input
                      id="surName"
                      name="surName"
                      value={newAdminForm.surName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      value={newAdminForm.middleName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={newAdminForm.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newAdminForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={newAdminForm.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={newAdminForm.country}
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
                      value={newAdminForm.stateOfOrigin}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={newAdminForm.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newAdminForm.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={newAdminForm.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Admin"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
