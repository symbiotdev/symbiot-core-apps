import { useEffect, useState } from 'react';
import { useRestoreApp } from './use-app-state';

export const useNativeNow = (intervalInSeconds?: number) => {
  const [now, setNow] = useState(new Date());

  useRestoreApp(() => {
    setNow(new Date());
  });

  useEffect(() => {
    const date = new Date();
    const timeout = setTimeout(
      () => setNow(date),
      (intervalInSeconds || 60 - date.getSeconds()) * 1000
    );

    return () => clearTimeout(timeout);
  }, [intervalInSeconds, now]);

  return {
    now,
    setNow,
  };
};
