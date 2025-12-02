import { useState, useEffect, useRef } from "react";

type UseCountAnimationOptions = {
  from: number;
  to: number;
  duration?: number;
  enabled?: boolean;
  onComplete?: () => void;
};

export function useCountAnimation({
  from,
  to,
  duration = 1500,
  enabled = true,
  onComplete,
}: UseCountAnimationOptions) {
  const [value, setValue] = useState(enabled ? from : to);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!enabled || hasAnimated.current || from === to) {
      setValue(to);
      return;
    }

    hasAnimated.current = true;
    setIsAnimating(true);
    
    const startTime = Date.now();
    const diff = to - from;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = from + diff * easeOutQuart;
      
      setValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(to);
        setIsAnimating(false);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [from, to, duration, enabled, onComplete]);

  return { value, isAnimating };
}
