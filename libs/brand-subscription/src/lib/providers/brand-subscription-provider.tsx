import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { AdaptivePopover, AdaptivePopoverRef } from '@symbiot-core-apps/ui';
import { BrandSubscriptionsPaywall } from '../components/brand-subscriptions-paywall';

type BrandSubscriptionContext = {
  packages: PurchasesPackage[];
  showPaywall: () => void;
};

const Context = createContext<BrandSubscriptionContext | undefined>(undefined);
const apiKeyByPlatform: Record<string, string> = {
  ios: String(process.env.EXPO_PUBLIC_REVENUE_CAT_IOS_KEY),
  android: String(process.env.EXPO_PUBLIC_REVENUE_CAT_ANDROID_KEY),
};

export const BrandSubscriptionProvider = ({ children }: PropsWithChildren) => {
  const { brand } = useCurrentBrandState();

  const paywallRef = useRef<AdaptivePopoverRef>(null);

  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [restoring, setRestoring] = useState<boolean>(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  const showPaywall = useCallback(() => paywallRef.current?.open(), []);

  const onSubscribe = useCallback(async (pkg: PurchasesPackage) => {
    try {
      setSubscribing(true);

      await Purchases.purchasePackage(pkg);

      paywallRef.current?.close();
    } finally {
      setSubscribing(false);
    }
  }, []);

  const onRestore = useCallback(async () => {
    try {
      setRestoring(true);

      await Purchases.restorePurchases();
    } finally {
      setRestoring(false);
    }
  }, []);

  useEffect(() => {
    const apiKey = apiKeyByPlatform[Platform.OS];

    if (
      !apiKey ||
      !brand?.id ||
      process.env.EXPO_PUBLIC_APP_MODE !== 'production'
    )
      return;

    void Purchases.setLogLevel(LOG_LEVEL.INFO);
    Purchases.configure({ apiKey });
    Purchases.getOfferings().then(({ all }) => {
      setPackages(
        Object.values(all).flatMap(
          ({ availablePackages }) => availablePackages,
        ),
      );
    });
  }, [brand?.id]);

  return (
    <Context.Provider
      value={{
        packages,
        showPaywall,
      }}
    >
      {children}

      {!!brand && !!packages.length && (
        <AdaptivePopover
          hideHandle
          unmountChildrenWhenHidden
          triggerType="manual"
          maxHeight={650}
          disabled={subscribing || restoring}
          disableDrag={subscribing || restoring}
          ref={paywallRef}
        >
          <BrandSubscriptionsPaywall
            offering={brand.offering}
            packages={packages}
            subscribing={subscribing}
            restoring={restoring}
            onSubscribe={onSubscribe}
            onRestore={onRestore}
          />
        </AdaptivePopover>
      )}
    </Context.Provider>
  );
};

export const useBrandSubscription = () =>
  useContext(Context) as BrandSubscriptionContext;
