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
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { AdaptivePopover, AdaptivePopoverRef } from '@symbiot-core-apps/ui';
import { AccountSubscriptionsPaywall } from '../components/account-subscriptions-paywall';
import {
  AccountSubscription,
  UpdateAccountSubscription,
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
  canSubscribe: boolean;
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
  const { currentEmployee } = useCurrentBrandEmployee();
  const { me, setMySubscriptions } = useCurrentAccountState();
  const { brand, setBrandSubscription } = useCurrentBrandState();
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

  const canSubscribe = useMemo(
    () =>
      Platform.OS !== 'web' &&
      !!packages.length &&
      !!me?.offering &&
      currentEmployee?.id === brand?.owner?.id,
    [brand?.owner?.id, currentEmployee?.id, me?.offering, packages.length],
  );

  const showPaywall = useCallback(() => paywallRef.current?.open(), []);

  const create = useCallback(
    async (customerInfo: CustomerInfo) => {
      const subscription = await createSubscription({
        userId: customerInfo.originalAppUserId,
        ...(mapCustomerInfoToAccountSubscription(
          customerInfo,
        ) as AccountSubscription),
      });

      setMySubscriptions([subscription]);
      setBrandSubscription(subscription);
    },
    [createSubscription, setBrandSubscription, setMySubscriptions],
  );

  const update = useCallback(
    async (data: UpdateAccountSubscription) => {
      const subscription = await updateSubscription(data);

      setMySubscriptions([subscription]);
      setBrandSubscription(subscription);
    },
    [setBrandSubscription, setMySubscriptions, updateSubscription],
  );

  const remove = useCallback(async () => {
    await removeSubscription();

    setMySubscriptions([]);
    setBrandSubscription(undefined);
  }, [removeSubscription, setBrandSubscription, setMySubscriptions]);

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
    if (!brand?.id) return;

    const handleCustomerInfo = async (customerInfo: CustomerInfo) => {
      if (!hasActiveSubscriptionChanges(customerInfo, brand.subscription))
        return;

      const activeSubscription =
        mapCustomerInfoToAccountSubscription(customerInfo);

      if (activeSubscription) {
        await (brand.subscription
          ? update(activeSubscription)
          : create(customerInfo));
      } else {
        await remove();
      }
    };

    Purchases.addCustomerInfoUpdateListener(handleCustomerInfo);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfo);
    };
  }, [brand?.id, brand?.subscription, create, remove, update]);

  return (
    <Context.Provider
      value={{
        packages,
        canSubscribe,
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
