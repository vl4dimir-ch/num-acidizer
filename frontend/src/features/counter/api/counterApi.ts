import { apiClient } from '../../../lib/api/client';
import type { CounterResponse } from './counterTypes';

export const counterApi = {
  getCounter: async (): Promise<CounterResponse> => {
    const response = await apiClient.get<CounterResponse>('/counter');
    return response.data;
  },

  incrementCounter: async (): Promise<CounterResponse> => {
    const response = await apiClient.post<CounterResponse>('/counter/increment');
    return response.data;
  },

  decrementCounter: async (): Promise<CounterResponse> => {
    const response = await apiClient.post<CounterResponse>('/counter/decrement');
    return response.data;
  },
}; 