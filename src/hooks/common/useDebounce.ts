import { useState, useEffect } from 'react';

/**
 * A reusable debounce hook that delays updating a value until after delay milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};