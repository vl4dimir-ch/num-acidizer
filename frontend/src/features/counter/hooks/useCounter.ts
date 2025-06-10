import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { counterApi } from '../api/counter.api';
import type { CounterResponse } from '../api/counter.types';

export const COUNTER_QUERY_KEY = ['counter'] as const;

export const useCounterQuery = () => {
  return useQuery({
    queryKey: COUNTER_QUERY_KEY,
    queryFn: counterApi.getCounter,
    staleTime: 30e3
  });
};

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
      queryClient.setQueryData<CounterResponse>(COUNTER_QUERY_KEY, data);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousValue) {
        queryClient.setQueryData(COUNTER_QUERY_KEY, context.previousValue);
      }
    },
  });
};

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
      queryClient.setQueryData<CounterResponse>(COUNTER_QUERY_KEY, data);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousValue) {
        queryClient.setQueryData(COUNTER_QUERY_KEY, context.previousValue);
      }
    },
  });
};

export const useCounter = () => {
  const query = useCounterQuery();
  const incrementMutation = useIncrementCounter();
  const decrementMutation = useDecrementCounter();

  return {
    counter: query.data?.value ?? 0,
    
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    isIncrementing: incrementMutation.isPending,
    isDecrementing: decrementMutation.isPending,
    
    increment: incrementMutation.mutate,
    decrement: decrementMutation.mutate,
    
    refetch: query.refetch,
  };
}; 