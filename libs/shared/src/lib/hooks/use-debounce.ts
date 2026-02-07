import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { isEqual } from '../utils/object';

export const useDebounceCallback = <T>(
  callback: (arg: T) => void,
  delay: number,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<T | null>(null);

  const debouncedCallback = useCallback(
    (arg: T) => {
      if (!delay) return callback(arg);

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

export function useDebounceValue<A>(value: A, delay = 0): A {
  const [state, setState] = React.useState(value);

  React.useEffect(() => {
    const timeout = setTimeout(
      () => setState((prev) => (isEqual(prev, value) ? prev : value)),
      delay,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, value]);

  return state;
}
