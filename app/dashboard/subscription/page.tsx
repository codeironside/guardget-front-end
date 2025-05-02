"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertTriangle,
  CreditCard,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import UserDashboardLayout from "@/components/user-dashboard-layout";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { subscriptionService } from "@/lib/api-service";

// Define types for API responses
type SubscriptionPlan = {
  _id: string;
  name: string;
  NoOfDevices?: number;
  NoOfDecives?: number; // Handle both spelling variations from API
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

type SubscriptionData = {
  status: "Active" | "Inactive";
  plan: string | null;
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
  paymentMethod: string | null;
};

type PaystackResponse = {
  status: string;
  data: {
    authorizationUrl: string;
    reference: string;
  };
};

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentRef =
    searchParams.get("reference") || searchParams.get("trxref");

  const [activeTab, setActiveTab] = useState("plans");
  const paymentTabRef = useRef<HTMLButtonElement>(null);
  const plansTabRef = useRef<HTMLButtonElement>(null);

  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [durationUnit, setDurationUnit] = useState<"months" | "years">(
    "months"
  );
  const [duration, setDuration] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Payment verification effect
  useEffect(() => {
    const verifyPayment = async () => {
      // Check if we have a reference from Paystack
      if (!paymentRef) return;

      try {
        setIsVerifyingPayment(true);

        // Get the authentication token
        const token = localStorage.getItem("accessToken");

        // Call the backend API to verify the payment
        const result = await subscriptionService.verifyPayment(paymentRef);

        if (result.status === "success") {
          // Show success message
          setShowSuccessMessage(true);

          toast({
            title: "Payment Successful! 🎉",
            description:
              result.message ||
              "Your subscription has been activated successfully.",
            variant: "default",
          });

          // Clear URL parameters and reload after a delay
          setTimeout(() => {
            window.history.replaceState(
              {},
              document.title,
              "/dashboard/subscription"
            );
            window.location.reload();
          }, 3000);
        } else {
          // Show error message
          toast({
            title: "Payment Verification Failed",
            description:
              result.message ||
              "Payment verification failed. Please contact support.",
            variant: "destructive",
          });

          // Clear URL parameters
          window.history.replaceState(
            {},
            document.title,
            "/dashboard/subscription"
          );
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast({
          title: "Error",
          description: "Failed to verify payment. Please try again.",
          variant: "destructive",
        });

        // Clear URL parameters
        window.history.replaceState(
          {},
          document.title,
          "/dashboard/subscription"
        );
      } finally {
        setIsVerifyingPayment(false);
      }
    };

    if (paymentRef) {
      verifyPayment();
    }
  }, [paymentRef]);

  // Fetch user's subscription status
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const result = await subscriptionService.getUserSubscription();

        if (result.status === "success") {
          setSubscriptionData(result.data);
        } else {
          // Fallback to mock data if API fails
          setSubscriptionData({
            status: "Inactive",
            plan: null,
            startDate: null,
            endDate: null,
            autoRenew: false,
            paymentMethod: null,
          });
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        // Fallback to mock data
        setSubscriptionData({
          status: "Inactive",
          plan: null,
          startDate: null,
          endDate: null,
          autoRenew: false,
          paymentMethod: null,
        });

        toast({
          title: "Error",
          description:
            "Failed to load your subscription data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  // Fetch available subscription plans from the API
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      setPlansLoading(true);

      try {
        const result = await subscriptionService.getPlans();

        if (result.status === "success" && Array.isArray(result.data)) {
          setSubscriptionPlans(result.data);
          if (result.data.length > 0) {
            setSelectedPlanId(result.data[0]._id);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription plans. Please try again.",
          variant: "destructive",
        });
      } finally {
        setPlansLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  // Handle duration input change
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 36) {
      setDuration(value);
    }
  };

  // Handle tab switching
  const handleContinueToPayment = () => {
    if (selectedPlanId) {
      setActiveTab("payment");
      paymentTabRef.current?.click();
    } else {
      toast({
        title: "Error",
        description: "Please select a subscription plan first",
        variant: "destructive",
      });
    }
  };

  // Handle subscription submission
  const handleSubscribe = async () => {
    if (!selectedPlanId) {
      toast({
        title: "Error",
        description: "Please select a subscription plan",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Prepare the request payload
    const payload = {
      subId: selectedPlanId,
      duration: duration,
      durationUnit: durationUnit,
    };

    try {
      const result = await subscriptionService.initializePayment(payload);

      if (result.status === "success" && result.data.authorizationUrl) {
        // Redirect to Paystack checkout page
        window.location.href = result.data.authorizationUrl;
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (error) {
      console.error("Error initiating subscription:", error);
      toast({
        title: "Payment Error",
        description: "Failed to process your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle cancel subscription
  const handleCancelSubscription = async () => {
    try {
      // In a real app, this would be an API call to cancel subscription
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end date.",
      });

      // Update the subscription data
      if (subscriptionData) {
        setSubscriptionData({
          ...subscriptionData,
          autoRenew: false,
        });
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to get device count from plan
  const getDeviceCount = (plan: SubscriptionPlan) => {
    return plan.NoOfDevices || plan.NoOfDecives || 0;
  };

  // Function to capitalize first letter of a string
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Payment verification loading overlay
  const PaymentVerificationOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-emerald-500 animate-pulse"></div>
            </div>
            <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mx-auto" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
        <p className="mb-6 text-muted-foreground">
          Please wait while we verify your payment with Paystack...
        </p>
        <div className="flex justify-center space-x-1 pt-2">
          <div
            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Success message component
  const SuccessMessage = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="mb-6 text-muted-foreground">
          Your subscription has been activated successfully. You will be
          redirected to your dashboard shortly.
        </p>
        <div className="flex justify-center">
          <Button onClick={() => (window.location.href = "/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading || plansLoading) {
    return (
      <UserDashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>

          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      {isVerifyingPayment && <PaymentVerificationOverlay />}
      {showSuccessMessage && <SuccessMessage />}

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your Guardget subscription
          </p>
        </div>

        {/* Active subscription card */}
        {subscriptionData?.status === "Active" ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Subscription</CardTitle>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Active</span>
                </Badge>
              </div>
              <CardDescription>
                Your subscription details and management options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Plan
                  </h3>
                  <p className="text-lg font-semibold">
                    {capitalize(subscriptionData.plan || "")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <p className="text-lg font-semibold">
                    {subscriptionData.status}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </h3>
                  <p className="text-lg font-semibold">
                    {subscriptionData.startDate &&
                      new Date(subscriptionData.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    End Date
                  </h3>
                  <p className="text-lg font-semibold">
                    {subscriptionData.endDate &&
                      new Date(subscriptionData.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Auto-Renew
                  </h3>
                  <p className="text-lg font-semibold">
                    {subscriptionData.autoRenew ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </h3>
                  <p className="text-lg font-semibold">
                    {subscriptionData.paymentMethod}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Update Payment Method</Button>
              <Button variant="destructive" onClick={handleCancelSubscription}>
                {subscriptionData.autoRenew
                  ? "Cancel Auto-Renewal"
                  : "Cancel Subscription"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Subscription Status</CardTitle>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Inactive</span>
                </Badge>
              </div>
              <CardDescription>
                You don't have an active subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Subscribe to Guardget to protect your devices and access all
                features. Choose a plan below to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Subscription plans */}
        {subscriptionData?.status !== "Active" && (
          <Card>
            <CardHeader>
              <CardTitle>Choose a Subscription Plan</CardTitle>
              <CardDescription>
                Select the plan that best fits your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="plans" ref={plansTabRef}>
                    Plans
                  </TabsTrigger>
                  <TabsTrigger value="payment" ref={paymentTabRef}>
                    Payment Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="plans">
                  <div className="grid gap-4 md:grid-cols-3">
                    {subscriptionPlans.map((plan) => (
                      <Card
                        key={plan._id}
                        className={
                          selectedPlanId === plan._id
                            ? "border-primary shadow-md"
                            : ""
                        }
                      >
                        <CardHeader>
                          <CardTitle className="capitalize">
                            {plan.name}
                          </CardTitle>
                          <CardDescription>
                            {plan.description || `For ${plan.name} users`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            ₦{plan.price.toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            per month
                          </p>
                          <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Up to {getDeviceCount(plan)} devices
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              {plan.name === "premium" || plan.name === "family"
                                ? "Priority"
                                : "Basic"}{" "}
                              support
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Device tracking
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            variant={
                              selectedPlanId === plan._id
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setSelectedPlanId(plan._id)}
                          >
                            {selectedPlanId === plan._id
                              ? "Selected"
                              : "Select"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleContinueToPayment}
                      disabled={!selectedPlanId}
                    >
                      Continue to Payment Details
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="payment">
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle>Subscription Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Selected Plan</Label>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-medium capitalize">
                                  {subscriptionPlans.find(
                                    (plan) => plan._id === selectedPlanId
                                  )?.name || "None"}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setActiveTab("plans")}
                                >
                                  Change
                                </Button>
                              </div>
                            </div>

                            <div>
                              <Label>Duration Unit</Label>
                              <RadioGroup
                                defaultValue="months"
                                value={durationUnit}
                                onValueChange={(value) =>
                                  setDurationUnit(value as "months" | "years")
                                }
                                className="mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="months" id="months" />
                                  <Label htmlFor="months">Months</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="years" id="years" />
                                  <Label htmlFor="years">Years</Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="duration">
                                Number of{" "}
                                {durationUnit === "months" ? "Months" : "Years"}
                              </Label>
                              <Input
                                id="duration"
                                type="number"
                                min="1"
                                max={durationUnit === "months" ? "36" : "5"}
                                value={duration}
                                onChange={handleDurationChange}
                                className="mt-1"
                              />
                            </div>

                            <div className="pt-4 border-t">
                              <p className="text-sm text-muted-foreground mb-2">
                                The final price will be calculated by the server
                                based on your selection.
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4 text-primary" />
                                <span>
                                  Payment will be processed securely via
                                  Paystack
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle>Payment Process</CardTitle>
                            <CardDescription>
                              You'll be redirected to Paystack to complete your
                              payment securely
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="rounded-lg border p-4">
                              <h3 className="font-medium mb-2">
                                What happens next?
                              </h3>
                              <ol className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    1
                                  </span>
                                  <span>
                                    Click the "Proceed to Payment" button below
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    2
                                  </span>
                                  <span>
                                    You'll be redirected to Paystack's secure
                                    payment page
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    3
                                  </span>
                                  <span>Complete your payment details</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    4
                                  </span>
                                  <span>
                                    After successful payment, you'll be
                                    redirected back to Guardget
                                  </span>
                                </li>
                              </ol>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-5 w-5 text-primary" />
                                  <span className="font-medium">
                                    Secure Payment
                                  </span>
                                </div>
                                <img
                                  src="/placeholder.svg?height=30&width=100"
                                  alt="Paystack"
                                  className="h-7"
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Your payment information is securely processed
                                by Paystack
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className="w-full"
                              onClick={handleSubscribe}
                              disabled={isProcessing || !selectedPlanId}
                            >
                              {isProcessing ? (
                                <span className="flex items-center gap-2">
                                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  Processing...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <ExternalLink className="h-4 w-4" />
                                  Proceed to Payment
                                </span>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </UserDashboardLayout>
  );
}
