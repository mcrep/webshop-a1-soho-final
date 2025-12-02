import { useState, useEffect, useRef } from "react";

type UseCountAnimationOptions = {
  value: number;
  duration?: number;
  enabled?: boolean;
};

export function useCountAnimation({
  value,
  duration = 800,
  enabled = true,
}: UseCountAnimationOptions) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const previousValue = useRef(value);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(value);
      return;
    }

    const from = previousValue.current;
    const to = value;
    previousValue.current = value;

    if (from === to) return;

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsAnimating(true);
    setDirection(to > from ? "up" : "down");
    const startTime = Date.now();
    const diff = to - from;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = from + diff * easeOutQuart;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(to);
        setIsAnimating(false);
        setDirection(null);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, enabled]);

  return { value: displayValue, isAnimating, direction };
}
