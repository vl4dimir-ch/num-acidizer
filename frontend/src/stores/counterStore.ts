import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useEffect } from 'react';
import { useCounter } from '../features/counter/hooks/useCounter';

interface CounterState {
  // Local state for optimistic updates and UI state
  localCount: number;
  setLocalCount: (value: number) => void;
  
  // Limits
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

// Custom hook that combines the store and API
export const useCounterWithStore = () => {
  const { localCount, setLocalCount, canIncrement, canDecrement, updateLimits } = useCounterStore();
  const api = useCounter();
  
  // Sync API data with local store
  useEffect(() => {
    if (api.counter !== undefined) {
      setLocalCount(api.counter);
      updateLimits(api.counter);
    }
  }, [api.counter, setLocalCount, updateLimits]);
  
  // Use API counter if available, otherwise fall back to local count
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
    increment: api.increment,
    decrement: api.decrement,
    
    // Limits
    canIncrement: canIncrement && !api.isIncrementing,
    canDecrement: canDecrement && !api.isDecrementing,
    
    // Utilities
    refetch: api.refetch,
  };
}; 