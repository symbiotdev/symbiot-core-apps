import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppState = () => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return {
    appState,
  };
};

export const useRestoreApp = (callback: () => void) => {
  const { appState } = useAppState();
  const lastAppStateRef = useRef<AppStateStatus>(appState);

  useEffect(() => {
    if (lastAppStateRef.current === 'background' && appState === 'active') {
      callback();
    }

    lastAppStateRef.current = appState;
  }, [appState, callback]);
};
