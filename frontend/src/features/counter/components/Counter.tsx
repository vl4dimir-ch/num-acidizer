import { useCounterStore } from '../../../stores/counterStore';
import { Button } from '../../../components/ui/Button';
import { useEffect, useRef, useState } from 'react';

export function Counter() {
  const { count, increment, decrement, canIncrement, canDecrement } = useCounterStore();
  const [displayCount, setDisplayCount] = useState(() => count);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);
  const targetValueRef = useRef<number>(0);

  useEffect(() => {
    if (Math.abs(count - displayCount) > 1) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      startTimeRef.current = Date.now();
      startValueRef.current = displayCount;
      targetValueRef.current = count;

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
      setDisplayCount(count);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [count]);

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Counter</h2>
        <div className="text-8xl font-bold text-blue-600 mb-8">
          {displayCount}
        </div>
      </div>
      
      <div className="flex items-center gap-x-8">
        <Button
          onClick={decrement}
          variant="outline"
          size="lg"
          className="w-16 h-16 text-2xl"
          circle
          disabled={!canDecrement}
        >
          -
        </Button>
        
        <Button
          onClick={increment}
          variant="primary"
          size="lg"
          className="w-16 h-16 text-2xl"
          circle
          disabled={!canIncrement}
        >
          +
        </Button>
      </div>
    </div>
  );
} 