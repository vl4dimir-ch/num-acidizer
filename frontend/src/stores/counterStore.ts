import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  setCount: (value: number) => void;
  canIncrement: boolean;
  canDecrement: boolean;
}

const MIN_COUNT = 0;
const MAX_COUNT = 1_000_000_000;

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      canIncrement: true,
      canDecrement: false,
      setCount: (value: number) =>
        set(
          () => {
            const newCount = Math.max(MIN_COUNT, Math.min(MAX_COUNT, value));
            return {
              count: newCount,
              canIncrement: newCount < MAX_COUNT,
              canDecrement: newCount > MIN_COUNT,
            };
          },
          false,
          'setCount'
        ),
      increment: () =>
        set(
          (state) => {
            if (state.count >= MAX_COUNT) return state;
            const newCount = state.count + 1;
            return {
              count: newCount,
              canIncrement: newCount < MAX_COUNT,
              canDecrement: newCount > MIN_COUNT,
            };
          },
          false,
          'increment'
        ),
      decrement: () =>
        set(
          (state) => {
            if (state.count <= MIN_COUNT) return state;
            const newCount = state.count - 1;
            return {
              count: newCount,
              canIncrement: newCount < MAX_COUNT,
              canDecrement: newCount > MIN_COUNT,
            };
          },
          false,
          'decrement'
        ),
    }),
    {
      name: 'counter-store',
    }
  )
); 