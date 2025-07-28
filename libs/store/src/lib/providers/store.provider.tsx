import { createContext, PropsWithChildren, useEffect } from 'react';
import { useStateClear } from '../hooks/use-state-clear';

const Context = createContext({});

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const clearState = useStateClear();

  useEffect(() => {
    return () => {
      clearState();
    };
  }, [clearState]);

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
