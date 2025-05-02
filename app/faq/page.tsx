"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "What is Guardget?",
      answer:
        "Guardget is a device protection service that helps you register, track, and recover your devices if they're lost or stolen. We also provide a verification system to check if a device has been reported as stolen before purchase.",
    },
    {
      question: "How much does Guardget cost?",
      answer:
        "Guardget offers affordable subscription plans starting at ₦100 per month or ₦1,000 per year. The yearly plan gives you two months free compared to the monthly plan.",
    },
    {
      question: "How do I register my device?",
      answer:
        "After creating an account and subscribing to a plan, you can register your device by logging into your dashboard and clicking on 'Register Device'. You'll need to provide details like the device type, model, IMEI number (for phones) or serial number (for laptops).",
    },
    {
      question: "What should I do if my device is stolen?",
      answer:
        "If your device is stolen, log into your Guardget account immediately and report it as stolen. Provide as much information as possible about where and when it was stolen. This will mark the device as stolen in our database, making it harder for thieves to resell it.",
    },
    {
      question: "How does the device status checker work?",
      answer:
        "Our device status checker allows anyone to verify if a device has been reported as stolen or missing before purchasing it. Simply enter the IMEI number (for phones) or serial number (for laptops) on our device status checker page, and we'll tell you if the device is registered, stolen, or missing.",
    },
    {
      question: "Can I use Guardget if I'm not in Nigeria?",
      answer:
        "While Guardget is primarily focused on Nigeria, we also serve users in Ghana, Kenya, and South Africa. We're continuously expanding to more countries across Africa.",
    },
    {
      question: "How does Guardget help recover stolen devices?",
      answer:
        "When a device is reported stolen, it's marked in our database. If someone tries to verify the device using our status checker, they'll see it's stolen. Additionally, we work with law enforcement and our network of partners to help track and recover stolen devices.",
    },
    {
      question: "What is a keyholder?",
      answer:
        "A keyholder is a trusted contact who can help verify your identity and assist in the recovery process if your device is stolen. When registering, you'll need to provide at least one keyholder's phone number.",
    },
    {
      question: "How many devices can I register?",
      answer:
        "With our standard subscription, you can register up to 5 devices. If you need to register more devices, please contact our support team for custom solutions.",
    },
    {
      question: "Is my data secure with Guardget?",
      answer:
        "Yes, we take data security very seriously. All your personal information and device details are encrypted and stored securely. We only share information with law enforcement when necessary for device recovery.",
    },
    {
      question: "Can I transfer ownership of my device to someone else?",
      answer:
        "Yes, if you sell or give your device to someone else, you can transfer ownership through your dashboard. The new owner will need to have a Guardget account to complete the transfer.",
    },
    {
      question: "What happens if I find my device after reporting it missing?",
      answer:
        "If you find your device after reporting it missing, you can log into your account and mark it as 'recovered'. This will update its status in our database.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-semibold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about Guardget's device protection
            services.
          </p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No FAQs match your search query.
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          )}
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <Link href="/contact">
            <Button>Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
