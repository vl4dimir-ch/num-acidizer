import { useState, useCallback, useEffect, useRef } from 'react';
import { counterApi } from '../api/counterApi';

interface CounterState {
  counter: number | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isIncrementing: boolean;
  isDecrementing: boolean;
}

export const useCounter = () => {
  const [state, setState] = useState<CounterState>({
    counter: undefined,
    isLoading: true,
    isError: false,
    error: null,
    isIncrementing: false,
    isDecrementing: false,
  });

  const hasInitiallyLoaded = useRef(false);

  const fetchCounter = useCallback(async (isInitialLoad = false) => {
    try {
      setState(prev => ({ ...prev, isLoading: isInitialLoad, isError: false, error: null }));
      
      const data = await counterApi.getCounter();
      setState(prev => ({ 
        ...prev, 
        counter: data.value, 
        isLoading: false 
      }));
      
      hasInitiallyLoaded.current = true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: hasInitiallyLoaded.current ? false : prev.isLoading,
        isError: true, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }));
    }
  }, []);

  const increment = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isIncrementing: true }));
      
      // Optimistic update
      if (state.counter !== undefined) {
        setState(prev => ({ ...prev, counter: prev.counter! + 1 }));
      }
      
      const data = await counterApi.incrementCounter();
      setState(prev => ({ 
        ...prev, 
        counter: data.value, 
        isIncrementing: false 
      }));
    } catch (error) {
      // Revert optimistic update on error
      if (state.counter !== undefined) {
        setState(prev => ({ ...prev, counter: prev.counter! - 1 }));
      }
      setState(prev => ({ 
        ...prev, 
        isIncrementing: false,
        isError: true, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }));
    }
  }, [state.counter]);

  const decrement = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isDecrementing: true }));
      
      // Optimistic update
      if (state.counter !== undefined) {
        setState(prev => ({ ...prev, counter: prev.counter! - 1 }));
      }
      
      const data = await counterApi.decrementCounter();
      setState(prev => ({ 
        ...prev, 
        counter: data.value, 
        isDecrementing: false 
      }));
    } catch (error) {
      // Revert optimistic update on error
      if (state.counter !== undefined) {
        setState(prev => ({ ...prev, counter: prev.counter! + 1 }));
      }
      setState(prev => ({ 
        ...prev, 
        isDecrementing: false,
        isError: true, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }));
    }
  }, [state.counter]);

  const refetch = useCallback(() => {
    fetchCounter(false);
  }, [fetchCounter]);

  useEffect(() => {
    fetchCounter(true);
  }, [fetchCounter]);

  return {
    counter: state.counter,
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,
    isIncrementing: state.isIncrementing,
    isDecrementing: state.isDecrementing,
    increment,
    decrement,
    refetch,
  };
}; 