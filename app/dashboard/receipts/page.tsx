"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import UserDashboardLayout from "@/components/user-dashboard-layout";

interface ReceiptItem {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: "paid" | "pending" | "failed";
  reference: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const receiptId = params.id as string;
  const [receipt, setReceipt] = useState<ReceiptItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        // In a real app, this would be an API call to fetch a specific receipt
        // Example: const response = await fetch(`/api/receipts/${receiptId}`)

        // Simulate API response
        setTimeout(() => {
          // Mock receipt data
          const mockReceipts: ReceiptItem[] = [
            {
              id: "rec_001",
              date: "2023-04-15T10:30:00Z",
              amount: 100,
              description: "Monthly Subscription - April 2023",
              status: "paid",
              reference: "GG-PAY-123456",
            },
            {
              id: "rec_002",
              date: "2023-05-15T10:30:00Z",
              amount: 100,
              description: "Monthly Subscription - May 2023",
              status: "paid",
              reference: "GG-PAY-234567",
            },
          ];

          const foundReceipt = mockReceipts.find((r) => r.id === receiptId);

          if (foundReceipt) {
            setReceipt(foundReceipt);
          } else {
            // If receipt not found, use Next.js notFound()
            notFound();
          }

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching receipt:", error);
        toast({
          title: "Error",
          description: "Failed to load receipt. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchReceipt();
  }, [receiptId]);

  const handleDownload = () => {
    if (!receipt) return;

    toast({
      title: "Receipt Downloaded",
      description: `Receipt ${receipt.reference} has been downloaded.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-600 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/receipts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Receipts
          </Link>
        </Button>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : receipt ? (
          <Card>
            <CardHeader>
              <CardTitle>Receipt Details</CardTitle>
              <CardDescription>
                Receipt reference: {receipt.reference}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between border-b pb-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Receipt Date
                    </p>
                    <p>{formatDate(receipt.date)}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm font-medium text-muted-foreground">
                      Amount
                    </p>
                    <p className="font-medium">
                      {formatCurrency(receipt.amount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <p>{receipt.description}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className={getStatusColor(receipt.status)}
                  >
                    {receipt.status.charAt(0).toUpperCase() +
                      receipt.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Reference Number
                  </p>
                  <p className="font-mono">{receipt.reference}</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </UserDashboardLayout>
  );
}
