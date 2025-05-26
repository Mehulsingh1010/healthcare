import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = []
): [(...args: Parameters<T>) => void, boolean] {
  const [isWaiting, setIsWaiting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef<T>(callback);
  
  // Update the callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...dependencies]);
  
  const debouncedFunction = (...args: Parameters<T>) => {
    setIsWaiting(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
      setIsWaiting(false);
      timerRef.current = null;
    }, delay);
  };
  
  // Clean up the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  return [debouncedFunction, isWaiting];
} 