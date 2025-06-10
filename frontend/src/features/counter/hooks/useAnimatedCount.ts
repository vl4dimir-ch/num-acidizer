import { useEffect, useRef, useState } from 'react';

export function useAnimatedCount(targetCount: number) {
  const [displayCount, setDisplayCount] = useState(() => targetCount);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);
  const targetValueRef = useRef<number>(0);

  useEffect(() => {
    if (Math.abs(targetCount - displayCount) > 1) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      startTimeRef.current = Date.now();
      startValueRef.current = displayCount;
      targetValueRef.current = targetCount;

      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const durationMs = 300;

        if (elapsed < durationMs) {
          const progress = elapsed / durationMs;
          const diff = targetValueRef.current - startValueRef.current;
          const currentValue = Math.round(startValueRef.current + (diff * progress));
          setDisplayCount(currentValue);
          timeoutRef.current = setTimeout(animate, 16); // ~60fps
        } else {
          setDisplayCount(targetValueRef.current);
        }
      };

      animate();
    } else {
      setDisplayCount(targetCount);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [targetCount, displayCount]);

  return displayCount;
} 