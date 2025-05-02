"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Individual form state
  const [formData, setFormData] = useState({
    surName: "",
    middleName: "",
    firstName: "",
    username: "",
    email: "",
    countryCode: "234",
    phoneNumber: "",
    role: "user",
    country: "Nigeria",
    stateOfOrigin: "",
    dateOfBirth: "",
    keyholderPhone1: "",
    keyholderPhone2: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [registrationToken, setRegistrationToken] = useState<string | null>(
    null
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.surName ||
      !formData.firstName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password
    ) {
      return toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }

    if (formData.password !== formData.confirmPassword) {
      return toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
    }

    if (!formData.agreeToTerms) {
      return toast({
        title: "Error",
        description: "You must agree to the Terms and Conditions",
        variant: "destructive",
      });
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3124/api/v1/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.message || "Registration failed");
      }
      setRegistrationToken(body.registrationToken);
      sessionStorage.setItem("registrationToken", body.registrationToken);
      toast({
        title: "Registration Initiated",
        description:
          "An OTP has been sent to your phone number for verification.",
      });
      router.push(
        `/auth/otp-verification?token=${encodeURIComponent(
          body.registrationToken
        )}`
      );
    } catch (err: any) {
      console.error("Registration error:", err);
      setRegistrationToken(null);
      sessionStorage.removeItem("registrationToken");
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Shield className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Create your Guardget account
              </CardTitle>
              <CardDescription>
                Protect your devices and gain peace of mind with Guardget
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="surname">Surname *</Label>
                        <Input
                          id="surName"
                          name="surName"
                          value={formData.surName}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input
                          id="middleName"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">User Name</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <div className="flex gap-2">
                          <Select
                            value={formData.countryCode}
                            onValueChange={(value) =>
                              handleSelectChange("countryCode", value)
                            }
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="234">234</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) =>
                            handleSelectChange("country", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                            {/* <SelectItem value="Ghana">Ghana</SelectItem>
                            <SelectItem value="Kenya">Kenya</SelectItem>
                            <SelectItem value="South Africa">South Africa</SelectItem> */}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stateOfOrigin">
                          State of Residence *
                        </Label>
                        <Select
                          value={formData.stateOfOrigin}
                          onValueChange={(value) =>
                            handleSelectChange("stateOfOrigin", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Abia">Abia</SelectItem>
                            <SelectItem value="Adamawa">Adamawa</SelectItem>
                            <SelectItem value="Akwa Ibom">Akwa Ibom</SelectItem>
                            <SelectItem value="Anambra">Anambra</SelectItem>
                            <SelectItem value="Bauchi">Bauchi</SelectItem>
                            <SelectItem value="Bayelsa">Bayelsa</SelectItem>
                            <SelectItem value="Benue">Benue</SelectItem>
                            <SelectItem value="Borno">Borno</SelectItem>
                            <SelectItem value="Cross River">
                              Cross River
                            </SelectItem>
                            <SelectItem value="Delta">Delta</SelectItem>
                            <SelectItem value="Ebonyi">Ebonyi</SelectItem>
                            <SelectItem value="Edo">Edo</SelectItem>
                            <SelectItem value="Ekiti">Ekiti</SelectItem>
                            <SelectItem value="Enugu">Enugu</SelectItem>
                            <SelectItem value="Gombe">Gombe</SelectItem>
                            <SelectItem value="Imo">Imo</SelectItem>
                            <SelectItem value="Jigawa">Jigawa</SelectItem>
                            <SelectItem value="Kaduna">Kaduna</SelectItem>
                            <SelectItem value="Kano">Kano</SelectItem>
                            <SelectItem value="Katsina">Katsina</SelectItem>
                            <SelectItem value="Kebbi">Kebbi</SelectItem>
                            <SelectItem value="Kogi">Kogi</SelectItem>
                            <SelectItem value="Kwara">Kwara</SelectItem>
                            <SelectItem value="Lagos">Lagos</SelectItem>
                            <SelectItem value="Nasarawa">Nasarawa</SelectItem>
                            <SelectItem value="Niger">Niger</SelectItem>
                            <SelectItem value="Ogun">Ogun</SelectItem>
                            <SelectItem value="Ondo">Ondo</SelectItem>
                            <SelectItem value="Osun">Osun</SelectItem>
                            <SelectItem value="Oyo">Oyo</SelectItem>
                            <SelectItem value="Plateau">Plateau</SelectItem>
                            <SelectItem value="Rivers">Rivers</SelectItem>
                            <SelectItem value="Sokoto">Sokoto</SelectItem>
                            <SelectItem value="Taraba">Taraba</SelectItem>
                            <SelectItem value="Yobe">Yobe</SelectItem>
                            <SelectItem value="Zamfara">Zamfara</SelectItem>
                            <SelectItem value="FCT">FCT (Abuja)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keyholderPhone1">
                          Key Holder Phone Number 1 *
                        </Label>
                        <Input
                          id="keyholderPhone1"
                          name="keyholderPhone1"
                          value={formData.keyholderPhone1}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keyholderPhone2">
                          Key Holder Phone Number 2
                        </Label>
                        <Input
                          id="keyholderPhone2"
                          name="keyholderPhone2"
                          value={formData.keyholderPhone2}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password *
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            agreeToTerms: checked as boolean,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="agreeToTerms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Registering...
                        </span>
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </form>
                </div>

                <div className="hidden md:flex flex-col justify-center items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=600&auto=format&fit=crop"
                      alt="Secure your devices"
                      width={400}
                      height={300}
                      className="rounded-lg"
                    />
                  </motion.div>
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">
                      Why Register with Guardget?
                    </h3>
                    <ul className="text-left space-y-2">
                      <li className="flex items-start">
                        <User className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>Protect your valuable devices</span>
                      </li>
                      <li className="flex items-start">
                        <User className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>Increase chances of recovery if stolen</span>
                      </li>
                      <li className="flex items-start">
                        <User className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>Verify device status before purchase</span>
                      </li>
                      <li className="flex items-start">
                        <User className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>Join thousands of protected users</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center justify-center p-6 border-t">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
