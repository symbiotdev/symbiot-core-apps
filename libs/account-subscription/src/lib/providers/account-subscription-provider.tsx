import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { AdaptivePopover, AdaptivePopoverRef } from '@symbiot-core-apps/ui';
import { AccountSubscriptionsPaywall } from '../components/account-subscriptions-paywall';
import {
  AccountSubscription,
  useAccountCreateSubscription,
  useAccountDeleteSubscription,
  useAccountUpdateSubscription,
} from '@symbiot-core-apps/api';
import {
  hasActiveSubscriptionChanges,
  mapCustomerInfoToAccountSubscription,
} from '../utils/customer-info-to-account-subscription';

type AccountSubscriptionContext = {
  packages: PurchasesPackage[];
  processing: boolean;
  showPaywall: () => void;
  manageSubscriptions: () => void;
};

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
  const { me, setMySubscription } = useCurrentAccountState();
  const { mutateAsync: createSubscription, isPending: subscriptionCreating } =
    useAccountCreateSubscription();
  const { mutateAsync: updateSubscription, isPending: subscriptionUpdating } =
    useAccountUpdateSubscription();
  const { mutateAsync: removeSubscription, isPending: subscriptionRemoving } =
    useAccountDeleteSubscription();

  const paywallRef = useRef<AdaptivePopoverRef>(null);

  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [restoring, setRestoring] = useState<boolean>(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  const showPaywall = useCallback(() => paywallRef.current?.open(), []);

  const onSubscribe = useCallback(
    async (pkg: PurchasesPackage) => {
      try {
        setSubscribing(true);

        const { customerInfo } = await Purchases.purchasePackage(pkg);

        void createSubscription({
          userId: customerInfo.originalAppUserId,
          ...(mapCustomerInfoToAccountSubscription(
            customerInfo,
          ) as AccountSubscription),
        });

        paywallRef.current?.close();
      } finally {
        setSubscribing(false);
      }
    },
    [createSubscription],
  );

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

    if (!apiKey || !me?.id || process.env.EXPO_PUBLIC_APP_MODE !== 'production')
      return;

    Purchases.configure({
      apiKey,
      appUserID: me.id,
    });
    Purchases.getOfferings().then(({ all }) =>
      setPackages(
        Object.values(all).flatMap(
          ({ availablePackages }) => availablePackages,
        ),
      ),
    );
  }, [me?.id]);

  useEffect(() => {
    if (!me?.id) return;

    const handleCustomerInfo = async (info: CustomerInfo) => {
      if (!hasActiveSubscriptionChanges(info, me?.subscription)) return;

      const activeSubscription = mapCustomerInfoToAccountSubscription(info);

      if (activeSubscription) {
        setMySubscription(await updateSubscription(activeSubscription));
      } else {
        await removeSubscription();

        setMySubscription(undefined);
      }
    };

    Purchases.addCustomerInfoUpdateListener(handleCustomerInfo);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfo);
    };
  }, [
    me?.id,
    me?.subscription,
    removeSubscription,
    setMySubscription,
    updateSubscription,
  ]);

  return (
    <Context.Provider
      value={{
        packages,
        processing:
          subscribing ||
          restoring ||
          subscriptionCreating ||
          subscriptionUpdating ||
          subscriptionRemoving,
        showPaywall,
        manageSubscriptions: Purchases.showManageSubscriptions,
      }}
    >
      {children}

      {!!me?.offering && !!packages.length && (
        <AdaptivePopover
          hideHandle
          unmountChildrenWhenHidden
          triggerType="manual"
          maxHeight={1000}
          disabled={subscribing || restoring}
          disableDrag={subscribing || restoring}
          ref={paywallRef}
        >
          <AccountSubscriptionsPaywall
            offering={me.offering}
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

export const useAccountSubscription = () =>
  useContext(Context) as AccountSubscriptionContext;
