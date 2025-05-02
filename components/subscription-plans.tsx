"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock subscription plans
const plans = [
  {
    id: "monthly",
    name: "Monthly",
    basePrice: 100,
    interval: "month",
    features: [
      "Register up to 5 devices",
      "Report stolen/missing devices",
      "Priority recovery assistance",
      "Free courier service for recovered devices",
    ],
    popular: false,
  },
  {
    id: "yearly",
    name: "Yearly",
    basePrice: 1000,
    interval: "year",
    features: [
      "Register up to 5 devices",
      "Report stolen/missing devices",
      "Priority recovery assistance",
      "Free courier service for recovered devices",
      "2 months free",
    ],
    popular: true,
  },
];

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quantities, setQuantities] = useState({
    monthly: 1,
    yearly: 1,
  });

  const handleQuantityChange = (planId: string, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");

    // Convert to number and ensure it's at least 1
    const quantity =
      numericValue === "" ? 1 : Math.max(1, Number.parseInt(numericValue, 10));

    setQuantities({
      ...quantities,
      [planId]: quantity,
    });
  };

  const calculatePrice = (basePrice: number, quantity: number) => {
    return basePrice * quantity;
  };

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    // Simulate API call to initiate payment
    setTimeout(() => {
      setIsLoading(false);

      // In a real app, this would redirect to Paystack or show a payment modal
      toast({
        title: "Payment Initiated",
        description: `You will be redirected to complete your ${planId} subscription payment for ${
          quantities[planId as keyof typeof quantities]
        } ${planId === "monthly" ? "months" : "years"}.`,
      });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative overflow-hidden ${
            plan.popular ? "border-primary" : ""
          }`}
        >
          {plan.popular && (
            <div className="absolute top-0 right-0">
              <Badge className="rounded-tl-none rounded-br-none">Popular</Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                ₦
                {calculatePrice(
                  plan.basePrice,
                  quantities[plan.id as keyof typeof quantities]
                ).toLocaleString()}
              </span>
              <span className="text-muted-foreground">/{plan.interval}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor={`quantity-${plan.id}`}>
                Number of {plan.interval}s:
              </Label>
              <Input
                id={`quantity-${plan.id}`}
                type="text"
                inputMode="numeric"
                value={quantities[plan.id as keyof typeof quantities]}
                onChange={(e) => handleQuantityChange(plan.id, e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              onClick={() => handleSubscribe(plan.id)}
              disabled={isLoading && selectedPlan === plan.id}
            >
              {isLoading && selectedPlan === plan.id ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Subscribe"
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
