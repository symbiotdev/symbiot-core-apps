import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { Linking, Platform } from 'react-native';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
  LoadingView,
} from '@symbiot-core-apps/ui';
import { SubscriptionsPaywall } from '../components/subscriptions-paywall';
import { DevelopmentPaywall } from '../components/development-paywall';

type AccountSubscriptionContext = {
  processing: boolean;
  canSubscribe: boolean;
  hasActualSubscription: boolean;
  isSubscriptionsAvailable: boolean;
  showPaywall: () => void;
  manageSubscriptions: () => Promise<void>;
};

const isDevMode =
  process.env['EXPO_PUBLIC_APP_MODE']?.indexOf('development') === 0;
const Context = createContext<AccountSubscriptionContext | undefined>(
  undefined,
);
const apiKeyByPlatform: Record<string, string> = {
  ios: String(process.env.EXPO_PUBLIC_REVENUE_CAT_IOS_KEY),
  android: String(process.env.EXPO_PUBLIC_REVENUE_CAT_ANDROID_KEY),
};

export const AccountSubscriptionProvider = ({
  children,
}: PropsWithChildren) => {
  const { currentEmployee } = useCurrentBrandEmployee();
  const { me } = useCurrentAccountState();
  const { brand } = useCurrentBrandState();

  const paywallRef = useRef<AdaptivePopoverRef>(null);

  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [restoring, setRestoring] = useState<boolean>(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  const isSubscriptionsAvailable = useMemo(
    () =>
      (Platform.OS !== 'web' || isDevMode) &&
      !me?.partner &&
      !!me?.offering &&
      !!brand?.owner?.id &&
      currentEmployee?.id === brand.owner.id,
    [brand?.owner?.id, currentEmployee?.id, me?.offering, me?.partner],
  );

  const hasActualSubscription = useMemo(
    () =>
      Boolean(
        me?.subscriptions?.some(({ active, canceled }) => active && !canceled),
      ),
    [me?.subscriptions],
  );

  const canSubscribe = useMemo(
    () => isSubscriptionsAvailable && !hasActualSubscription,
    [isSubscriptionsAvailable, hasActualSubscription],
  );

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

  const manageSubscriptions = useCallback(async () => {
    if (Platform.OS === 'ios') {
      return Purchases.showManageSubscriptions();
    } else if (Platform.OS === 'android') {
      return Linking.openURL(
        `https://play.google.com/store/account/subscriptions`,
      );
    } else {
      return alert('Impossible to open Manage Subscriptions');
    }
  }, []);

  useEffect(() => {
    const apiKey = apiKeyByPlatform[Platform.OS];

    if (isDevMode || !apiKey || !me?.id || !canSubscribe) return;

    Purchases.configure({ apiKey, appUserID: me.id });
    Purchases.getOfferings().then(({ all }) =>
      setPackages(
        Object.values(all).flatMap(
          ({ availablePackages }) => availablePackages,
        ),
      ),
    );
  }, [canSubscribe, me?.id]);

  return (
    <Context.Provider
      value={{
        canSubscribe,
        hasActualSubscription,
        isSubscriptionsAvailable,
        processing: subscribing || restoring,
        showPaywall,
        manageSubscriptions,
      }}
    >
      {children}

      {!!me?.offering && (
        <AdaptivePopover
          hideHandle
          unmountChildrenWhenHidden
          triggerType="manual"
          maxHeight={1000}
          disabled={subscribing || restoring}
          disableDrag={subscribing || restoring}
          ref={paywallRef}
        >
          {isDevMode ? (
            <DevelopmentPaywall />
          ) : (
            <>
              {!packages.length && <LoadingView />}

              {!!packages.length && (
                <SubscriptionsPaywall
                  offering={me.offering}
                  packages={packages}
                  subscribing={subscribing}
                  restoring={restoring}
                  onSubscribe={onSubscribe}
                  onRestore={onRestore}
                />
              )}
            </>
          )}
        </AdaptivePopover>
      )}
    </Context.Provider>
  );
};

export const useAccountSubscription = () =>
  useContext(Context) as AccountSubscriptionContext;
