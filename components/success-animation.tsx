"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ConfettiEffect from "@/components/confetti-effect";

interface SuccessAnimationProps {
  message: string;
}

export default function SuccessAnimation({ message }: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <ConfettiEffect />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card p-8 rounded-xl shadow-lg text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 1.5 }}
          className="mb-6"
        >
          <Image
            src="/vuvuzela.png"
            alt="Celebration"
            width={120}
            height={120}
            className="mx-auto"
          />
        </motion.div>
        <h2 className="text-2xl font-bold mb-4 text-primary">{message}</h2>
        <p className="text-muted-foreground mb-6">
          Your action was completed successfully!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsVisible(false)}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium"
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
}
