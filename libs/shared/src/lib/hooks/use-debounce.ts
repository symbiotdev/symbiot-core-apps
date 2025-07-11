import { useCallback, useEffect, useRef } from 'react';

export const useDebounceCallback = <T>(
  callback: (arg: T) => void,
  delay: number,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<T | null>(null);

  const debouncedCallback = useCallback(
    (arg: T) => {
      lastArgsRef.current = arg;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (lastArgsRef.current !== null) {
          callback(lastArgsRef.current);
        }
      }, delay);
    },
    [callback, delay],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedCallback;
};
