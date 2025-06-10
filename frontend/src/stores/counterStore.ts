import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useEffect, useRef, useCallback } from 'react';
import { useCounter } from '../features/counter/hooks/useCounter';

interface CounterState {
  localCount: number;
  setLocalCount: (value: number) => void;
  
  canIncrement: boolean;
  canDecrement: boolean;
  updateLimits: (count: number) => void;
}

const MIN_COUNT = 0;
const MAX_COUNT = 1_000_000_000;

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      localCount: 0,
      canIncrement: true,
      canDecrement: false,
      
      setLocalCount: (value: number) =>
        set(
          () => {
            const newCount = Math.max(MIN_COUNT, Math.min(MAX_COUNT, value));
            return {
              localCount: newCount,
              canIncrement: newCount < MAX_COUNT,
              canDecrement: newCount > MIN_COUNT,
            };
          },
          false,
          'setLocalCount'
        ),
      
      updateLimits: (count: number) =>
        set(
          () => ({
            canIncrement: count < MAX_COUNT,
            canDecrement: count > MIN_COUNT,
          }),
          false,
          'updateLimits'
        ),
    }),
    {
      name: 'counter-store',
    }
  )
);

export const useCounterWithStore = () => {
  const { localCount, setLocalCount, canIncrement, canDecrement, updateLimits } = useCounterStore();
  const api = useCounter();
  const lastActionTime = useRef<number>(0);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  
  const trackAction = useCallback(() => {
    lastActionTime.current = Date.now();
  }, []);
  
  const increment = useCallback(() => {
    trackAction();
    return api.increment();
  }, [api, trackAction]);
  
  const decrement = useCallback(() => {
    trackAction();
    return api.decrement();
  }, [api, trackAction]);
  
  useEffect(() => {
    if (api.counter !== undefined) {
      setLocalCount(api.counter);
      updateLimits(api.counter);
    }
  }, [api.counter, setLocalCount, updateLimits]);
  
  // Set up polling interval
  useEffect(() => {
    const startPolling = () => {
      pollingInterval.current = setInterval(() => {
        const timeSinceLastAction = Date.now() - lastActionTime.current;
        const shouldPoll = timeSinceLastAction >= 5000;
        
        if (shouldPoll && !api.isIncrementing && !api.isDecrementing) {
          api.refetch();
        }
      }, 5000);
    };
    
    startPolling();
    
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [api]);
  
  const currentCount = api.counter ?? localCount;
  
  return {
    count: currentCount,
    
    // API states
    isLoading: api.isLoading,
    isError: api.isError,
    error: api.error,
    isIncrementing: api.isIncrementing,
    isDecrementing: api.isDecrementing,
    
    // Actions
    increment,
    decrement,
    
    // Limits - disable both buttons when any operation is in progress
    canIncrement: canIncrement && !api.isIncrementing && !api.isDecrementing,
    canDecrement: canDecrement && !api.isIncrementing && !api.isDecrementing,
    
    // Utilities
    refetch: api.refetch,
  };
}; 