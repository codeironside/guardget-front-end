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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Download, Receipt, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReceiptItem {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    username: string;
    phoneNumber: string;
    email: string;
    imageurl?: string;
    subscriptionStatus: string;
  };
  formattedDate: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReceipts(1);
  }, []);

  useEffect(() => {
    filterReceipts();
  }, [receipts, searchQuery, statusFilter]);

  const fetchReceipts = async (page: number) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Example: const response = await fetch(`/api/admin/receipts?page=${page}&limit=20`)

      // Simulate API response
      setTimeout(() => {
        const mockResponse = {
          status: "success",
          meta: {
            page: page,
            limit: 20,
            total: 4,
            pages: 1,
          },
          data: [
            {
              _id: "680e8b18b3951f8cc7302130",
              amount: 400,
              status: "completed",
              createdAt: "2025-04-27T19:52:56.346Z",
              updatedAt: "2025-04-27T19:52:56.346Z",
              user: {
                _id: "680e8919db341ca6b1d159aa",
                username: "Angelgold12",
                phoneNumber: "2349067455212",
                email: "angel.adekunle@example.ng",
                subscriptionStatus: "Active",
              },
              formattedDate: "2025-04-27 19:52:56",
            },
            {
              _id: "680e481b747ac30756899f0f",
              amount: 400,
              status: "completed",
              createdAt: "2025-04-27T15:07:07.416Z",
              updatedAt: "2025-04-27T15:07:07.416Z",
              user: {
                _id: "680d434222c953679fca02c2",
                username: "Adekunlegold12",
                phoneNumber: "2349038745017",
                email: "tobi.adekunle@example.ng",
                imageurl:
                  "http://localhost:3124/usersimages/baf36f43d43f60e879765f3a83de6642.png",
                subscriptionStatus: "Active",
              },
              formattedDate: "2025-04-27 15:07:07",
            },
            {
              _id: "680e47c13fe3e52a34a0e0a0",
              amount: 400,
              status: "completed",
              createdAt: "2025-04-27T15:05:37.347Z",
              updatedAt: "2025-04-27T15:05:37.347Z",
              user: {
                _id: "680d434222c953679fca02c2",
                username: "Adekunlegold12",
                phoneNumber: "2349038745017",
                email: "tobi.adekunle@example.ng",
                imageurl:
                  "http://localhost:3124/usersimages/baf36f43d43f60e879765f3a83de6642.png",
                subscriptionStatus: "Active",
              },
              formattedDate: "2025-04-27 15:05:37",
            },
            {
              _id: "680e4639b8ac3f14c4552e12",
              amount: 400,
              status: "completed",
              createdAt: "2025-04-27T14:59:05.995Z",
              updatedAt: "2025-04-27T14:59:05.995Z",
              user: {
                _id: "680d434222c953679fca02c2",
                username: "Adekunlegold12",
                phoneNumber: "2349038745017",
                email: "tobi.adekunle@example.ng",
                imageurl:
                  "http://localhost:3124/usersimages/baf36f43d43f60e879765f3a83de6642.png",
                subscriptionStatus: "Active",
              },
              formattedDate: "2025-04-27 14:59:05",
            },
          ],
        };

        setReceipts(mockResponse.data);
        setMeta(mockResponse.meta);
        setCurrentPage(page);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast({
        title: "Error",
        description: "Failed to load receipts. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const filterReceipts = () => {
    let filtered = [...receipts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (receipt) =>
          receipt.user.username.toLowerCase().includes(query) ||
          receipt.user.email.toLowerCase().includes(query) ||
          receipt._id.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((receipt) => receipt.status === statusFilter);
    }

    setFilteredReceipts(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterReceipts();
  };

  const handleDownload = (receipt: ReceiptItem) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt ${receipt._id} has been downloaded.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Receipts Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all payment receipts in the system.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Receipts</CardTitle>
                <CardDescription>
                  Total {meta.total} receipts, showing page {meta.page} of{" "}
                  {meta.pages}
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search receipts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full md:w-64"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredReceipts.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        Receipt ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-right py-3 px-4 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReceipts.map((receipt) => (
                      <tr key={receipt._id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Receipt className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-mono text-sm">
                              {receipt._id.substring(0, 10)}...
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              {receipt.user.imageurl ? (
                                <AvatarImage
                                  src={
                                    receipt.user.imageurl || "/placeholder.svg"
                                  }
                                  alt={receipt.user.username}
                                />
                              ) : (
                                <AvatarFallback>
                                  {getInitials(receipt.user.username)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {receipt.user.username}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {receipt.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {formatCurrency(receipt.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={getStatusColor(receipt.status)}
                          >
                            {receipt.status.charAt(0).toUpperCase() +
                              receipt.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(receipt.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/receipts/${receipt._id}`}>
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(receipt)}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Receipts Found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== "all"
                      ? "No receipts match your search criteria."
                      : "There are no payment receipts in the system yet."}
                  </p>
                </div>
              )}
            </div>

            {meta.pages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchReceipts(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: meta.pages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => fetchReceipts(page)}
                          disabled={isLoading}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchReceipts(currentPage + 1)}
                    disabled={currentPage === meta.pages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
