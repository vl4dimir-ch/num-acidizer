import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { counterApi } from '../api/counter.api';
import type { CounterResponse } from '../api/counter.types';

export const COUNTER_QUERY_KEY = ['counter'] as const;

// Query hook to get current counter value
export const useCounterQuery = () => {
  return useQuery({
    queryKey: COUNTER_QUERY_KEY,
    queryFn: counterApi.getCounter,
    staleTime: 30e3
  });
};

// Mutation hook for incrementing counter
export const useIncrementCounter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: counterApi.incrementCounter,
    onMutate: async (): Promise<{ previousValue: CounterResponse | undefined }> => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: COUNTER_QUERY_KEY });

      // Snapshot the previous value
      const previousValue = queryClient.getQueryData<CounterResponse>(COUNTER_QUERY_KEY);

      // Optimistically update to the expected value
      if (previousValue) {
        queryClient.setQueryData<CounterResponse>(COUNTER_QUERY_KEY, {
          value: previousValue.value + 1,
        });
      }

      return { previousValue };
    },
    onSuccess: (data) => {
      // Update the cache with the actual response from the server
      queryClient.setQueryData<CounterResponse>(COUNTER_QUERY_KEY, data);
    },
    onError: (error, variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousValue) {
        queryClient.setQueryData(COUNTER_QUERY_KEY, context.previousValue);
      }
    },
  });
};

// Mutation hook for decrementing counter
export const useDecrementCounter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: counterApi.decrementCounter,
    onMutate: async (): Promise<{ previousValue: CounterResponse | undefined }> => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: COUNTER_QUERY_KEY });

      // Snapshot the previous value
      const previousValue = queryClient.getQueryData<CounterResponse>(COUNTER_QUERY_KEY);

      // Optimistically update to the expected value
      if (previousValue) {
        queryClient.setQueryData<CounterResponse>(COUNTER_QUERY_KEY, {
          value: previousValue.value - 1,
        });
      }

      return { previousValue };
    },
    onSuccess: (data) => {
      // Update the cache with the actual response from the server
      queryClient.setQueryData<CounterResponse>(COUNTER_QUERY_KEY, data);
    },
    onError: (error, variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousValue) {
        queryClient.setQueryData(COUNTER_QUERY_KEY, context.previousValue);
      }
    },
  });
};

// Combined hook that provides all counter functionality
export const useCounter = () => {
  const query = useCounterQuery();
  const incrementMutation = useIncrementCounter();
  const decrementMutation = useDecrementCounter();

  return {
    // Data
    counter: query.data?.value ?? 0,
    
    // Loading states
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Mutation states
    isIncrementing: incrementMutation.isPending,
    isDecrementing: decrementMutation.isPending,
    
    // Actions
    increment: incrementMutation.mutate,
    decrement: decrementMutation.mutate,
    
    // Utility
    refetch: query.refetch,
  };
}; 