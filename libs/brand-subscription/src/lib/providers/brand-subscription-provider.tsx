import { createContext, PropsWithChildren, useContext } from 'react';

type BrandSubscriptionContext = {};

const Context = createContext<BrandSubscriptionContext | undefined>(undefined);

export const BrandSubscriptionProvider = ({ children }: PropsWithChildren) => {
  return <Context.Provider value={{}}>{children}</Context.Provider>;
};

export const useBrandSubscription = () =>
  useContext(Context) as BrandSubscriptionContext;
