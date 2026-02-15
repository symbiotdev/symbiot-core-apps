import {
  createZustandStorage,
  SystemScheme,
  useSystemScheme,
} from '@symbiot-core-apps/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCallback, useMemo } from 'react';

type State = {
  scheme: SystemScheme | null;
  setScheme: (scheme: State['scheme']) => void;
};

const useState = create<State>()(
  persist<State>(
    (set) => ({
      scheme: null,
      setScheme: (scheme) => set({ scheme }),
    }),
    {
      name: 'symbiot::app-scheme',
      storage: createZustandStorage(),
    },
  ),
);

export const useAppScheme = () => {
  const { scheme: systemScheme } = useSystemScheme();
  const { scheme: appScheme, setScheme: setAppScheme } = useState();

  return {
    scheme: useMemo(() => appScheme || systemScheme, [appScheme, systemScheme]),
    setScheme: useCallback(
      (scheme: State['scheme']) => setAppScheme(scheme),
      [setAppScheme],
    ),
  };
};
