"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Smartphone,
  Search,
  Truck,
  Ban,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import CounterAnimation from "@/components/counter-animation";
import TestimonialCard from "@/components/testimonial-card";
import { motion } from "framer-motion";
import SubscriptionPlans from "@/components/subscription-plans";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
          <Image
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1920&auto=format&fit=crop"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="headline mb-6 text-foreground">
                Guardget – miss call, not phone.
              </h1>
              <p className="text-xl mb-8 text-muted-foreground font-light">
                Panic? Not with us. Protect your devices with our advanced
                tracking and recovery services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link href="/device-status">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Check Device Status
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Download our app:
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1511075675422-c8e008f749d7?q=80&w=100&auto=format&fit=crop"
                      alt="Google Play"
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                    <span>Google Play</span>
                    <Badge variant="secondary" className="ml-1">
                      Soon
                    </Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1611944212129-29977ae1398c?q=80&w=100&auto=format&fit=crop"
                      alt="App Store"
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                    <span>App Store</span>
                    <Badge variant="secondary" className="ml-1">
                      Soon
                    </Badge>
                  </Button>
                </div>
              </div>
            </motion.div>
            <div className="relative hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400&auto=format&fit=crop"
                alt="Smartphone with Guardget app"
                width={400}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-6 text-center">
                <h3 className="text-4xl font-bold mb-2 text-primary">
                  {isClient && <CounterAnimation end={15000} duration={2} />}+
                </h3>
                <p className="text-muted-foreground">Users</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-6 text-center">
                <h3 className="text-4xl font-bold mb-2 text-primary">
                  {isClient && <CounterAnimation end={5000} duration={2} />}+
                </h3>
                <p className="text-muted-foreground">Reported Devices</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-6 text-center">
                <h3 className="text-4xl font-bold mb-2 text-primary">
                  {isClient && <CounterAnimation end={3500} duration={2} />}+
                </h3>
                <p className="text-muted-foreground">Recovered Devices</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-semibold mb-4">
                Choose Your Protection Plan
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Secure your devices with our affordable subscription plans and
                enjoy peace of mind.
              </p>
            </motion.div>
          </div>
          <SubscriptionPlans />
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-semibold mb-4">
                The Problem We Solve
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Phone theft is a growing concern worldwide. When your device is
                stolen, you lose more than just hardware—you lose your data,
                memories, and peace of mind.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold mb-4">Our Solution</h3>
              <p className="text-muted-foreground mb-6">
                Guardget provides a comprehensive solution to protect your
                devices and help recover them if they're lost or stolen.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Register your devices securely in our database</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Report lost or stolen devices instantly</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Prevent unauthorized resale with our device status checker
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Recover your device with our network of partners</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              className="order-1 md:order-2 relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1605170439002-90845e45c67a?q=80&w=400&auto=format&fit=crop"
                alt="Phone theft problem"
                width={400}
                height={400}
                className="rounded-lg mx-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Guardget offers a comprehensive suite of features to protect
                your devices and give you peace of mind.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="device-card h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Enhanced Mobile Tracking
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Register your devices and track them if they're lost or
                    stolen.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="device-card h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Priority Recovery
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get priority phone recovery assistance from our dedicated
                    team.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="device-card h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Free Courier Service
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enjoy free courier service for recovered devices within your
                    region.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="device-card h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Ban className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Anti-Sale Protection
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Prevent unauthorized resale of your stolen devices with our
                    status checker.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold mb-4">
              Why Wait? Protect Your Peace of Mind Today
            </h2>
            <p className="max-w-2xl mx-auto mb-8">
              Subscribe to Guardget for just ₦100 per month and get
              comprehensive protection for your devices.
            </p>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="font-semibold">
                Subscribe Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-semibold mb-4">
                What Our Users Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our users have to
                say about Guardget.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <TestimonialCard
                name="Dahiru"
                quote="I thought I'd never see my phone again after it was stolen at a bus stop. Thanks to Guardget, I got it back within a week!"
                imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TestimonialCard
                name="Chinedu"
                quote="The device status checker saved me from buying a stolen phone. Best ₦100 I spend every month!"
                imageSrc="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&h=200&fit=crop&crop=faces&auto=format"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TestimonialCard
                name="Isah"
                quote="My laptop was recovered after being stolen from my office. Guardget's team was incredibly helpful throughout the process."
                imageSrc="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&h=200&fit=crop&crop=faces&auto=format"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TestimonialCard
                name="Segun"
                quote="I love the peace of mind knowing my devices are protected. The service is worth every kobo."
                imageSrc="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Device Status Checker Promo */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=400&auto=format&fit=crop"
                alt="Device Status Checker"
                width={400}
                height={400}
                className="rounded-lg mx-auto"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-semibold mb-4">
                Don't Get Played—Know Before You Buy
              </h2>
              <p className="text-muted-foreground mb-6">
                Planning to buy a used phone or laptop? Check its status first
                with our free device status checker to ensure it's not reported
                stolen or missing.
              </p>
              <Link href="/device-status">
                <Button className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Check Device Status</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
