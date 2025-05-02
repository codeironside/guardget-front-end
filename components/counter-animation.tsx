"use client";

import { useState, useEffect, useRef } from "react";

interface CounterAnimationProps {
  end: number;
  duration?: number;
  start?: number;
}

const CounterAnimation = ({
  end,
  duration = 2,
  start = 0,
}: CounterAnimationProps) => {
  const [count, setCount] = useState(start);
  const countRef = useRef<number>(start);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing function for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentCount = Math.floor(start + easedProgress * (end - start));
      countRef.current = currentCount;
      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, start]);

  return <>{count.toLocaleString()}</>;
};

export default CounterAnimation;
