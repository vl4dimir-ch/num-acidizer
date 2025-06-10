import { useCounterWithStore } from '../../../stores/counterStore';
import { Button } from '../../../components/ui/Button';
import { useEffect, useRef, useState } from 'react';
import { ApiError } from '../../../lib/api/client';

export function Counter() {
  const {
    count,
    increment,
    decrement,
    canIncrement,
    canDecrement,
    isLoading,
    isError,
    error,
    isIncrementing,
    isDecrementing,
    refetch,
  } = useCounterWithStore();
  
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
  }, [count, displayCount]);

  const handleIncrement = () => {
    increment();
  };

  const handleDecrement = () => {
    decrement();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Counter</h2>
          <div className="text-8xl font-bold text-gray-400 mb-8 animate-pulse">
            ...
          </div>
          <p className="text-gray-600">Loading counter...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error instanceof ApiError 
      ? error.message 
      : 'An unexpected error occurred';

    return (
      <div className="flex flex-col items-center space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Counter</h2>
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Error</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="md"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
          onClick={handleDecrement}
          variant="outline"
          size="lg"
          className="w-16 h-16 text-2xl relative"
          circle
          disabled={!canDecrement}
        >
          {isDecrementing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
          ) : (
            '-'
          )}
        </Button>
        
        <Button
          onClick={handleIncrement}
          variant="primary"
          size="lg"
          className="w-16 h-16 text-2xl relative"
          circle
          disabled={!canIncrement}
        >
          {isIncrementing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            '+'
          )}
        </Button>
      </div>
    </div>
  );
} 