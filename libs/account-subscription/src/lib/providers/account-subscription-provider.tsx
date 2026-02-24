import React, {
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
import { Linking, ScrollView } from 'react-native';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { SlideSheetModal } from '@symbiot-core-apps/ui';
import { SubscriptionsPaywall } from '../components/subscriptions-paywall';
import { DevelopmentPaywall } from '../components/development-paywall';
import { PromoCodeApplyForm } from '../components/promo-code-apply-form';
import {
  DeiceOS,
  isAndroid,
  isIos,
  isWeb,
  useI18n,
} from '@symbiot-core-apps/shared';
import {
  AdaptiveSheet,
  AdaptiveSheetRef,
  LoadingView,
} from '@symbiot-core-apps/ui2';

type AccountSubscriptionContext = {
  processing: boolean;
  canSubscribe: boolean;
  hasActualSubscription: boolean;
  hasFullAccess: boolean;
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
const apiKey = apiKeyByPlatform[DeiceOS];

export const AccountSubscriptionProvider = ({
  children,
}: PropsWithChildren) => {
  const { t } = useI18n();
  const { me } = useCurrentAccountState();
  const { brand } = useCurrentBrandState();
  const { currentEmployee } = useCurrentBrandEmployee();

  const sheetRef = useRef<AdaptiveSheetRef>(null);

  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [restoring, setRestoring] = useState<boolean>(false);
  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [isPromoCodeFormVisible, setIsPromoCodeFormVisible] =
    useState<boolean>(false);

  const hasFullAccess = useMemo(() => Boolean(me?.partner), [me?.partner]);

  const isSubscriptionsAvailable = useMemo(
    () =>
      (!isWeb || isDevMode) &&
      !hasFullAccess &&
      !!me?.offering &&
      !!brand?.owner?.id &&
      currentEmployee?.id === brand.owner.id,
    [brand?.owner?.id, currentEmployee?.id, me?.offering, hasFullAccess],
  );

  const hasActualSubscription = useMemo(
    () =>
      Boolean(
        hasFullAccess ||
        me?.subscriptions?.some(({ active, canceled }) => active && !canceled),
      ),
    [hasFullAccess, me?.subscriptions],
  );

  const canSubscribe = useMemo(
    () => isSubscriptionsAvailable && !hasActualSubscription,
    [isSubscriptionsAvailable, hasActualSubscription],
  );

  const showPaywall = useCallback(() => sheetRef.current?.show(), []);

  const closePaywall = useCallback(() => sheetRef.current?.hide(), []);

  const showPromoCodeForm = useCallback(() => {
    closePaywall();
    setTimeout(() => setIsPromoCodeFormVisible(true), 500);
  }, [closePaywall]);

  const closePromoCodeForm = useCallback(() => {
    setIsPromoCodeFormVisible(false);
    setTimeout(showPaywall, 500);
  }, [showPaywall]);

  const onSubscribe = useCallback(
    async (pkg: PurchasesPackage) => {
      try {
        setSubscribing(true);

        await Purchases.purchasePackage(pkg);

        closePaywall();
      } finally {
        setSubscribing(false);
      }
    },
    [closePaywall],
  );

  const onRestore = useCallback(async () => {
    try {
      setRestoring(true);

      await Purchases.restorePurchases();
    } finally {
      setRestoring(false);
    }
  }, []);

  const manageSubscriptions = useCallback(async () => {
    if (isIos) {
      return Purchases.showManageSubscriptions();
    } else if (isAndroid) {
      return Linking.openURL(
        `https://play.google.com/store/account/subscriptions`,
      );
    } else {
      return alert('Impossible to open Manage Subscriptions');
    }
  }, []);

  useEffect(() => {
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
        hasFullAccess,
        hasActualSubscription,
        isSubscriptionsAvailable,
        processing: subscribing || restoring,
        showPaywall,
        manageSubscriptions,
      }}
    >
      {children}

      {!isPromoCodeFormVisible && !!me?.offering && (
        <AdaptiveSheet
          sheetHandleVisible={false}
          disabled={subscribing || restoring}
          ref={sheetRef}
        >
          {isDevMode ? (
            <DevelopmentPaywall onApplyPromoCode={showPromoCodeForm} />
          ) : (
            <ScrollView>
              {!packages.length && <LoadingView />}

              {!!packages.length && (
                <SubscriptionsPaywall
                  offering={me.offering}
                  offeredPrivileges={me.offeredPrivileges}
                  packages={packages}
                  subscribing={subscribing}
                  restoring={restoring}
                  onRestore={onRestore}
                  onSubscribe={onSubscribe}
                  onApplyPromoCode={showPromoCodeForm}
                />
              )}
            </ScrollView>
          )}
        </AdaptiveSheet>
      )}

      <SlideSheetModal
        withKeyboard
        scrollable
        headerTitle={t('shared.partner_program.promo_code.exists')}
        visible={isPromoCodeFormVisible}
        onClose={closePromoCodeForm}
      >
        <PromoCodeApplyForm onApplied={closePromoCodeForm} />
      </SlideSheetModal>
    </Context.Provider>
  );
};

export const useAccountSubscription = () =>
  useContext(Context) as AccountSubscriptionContext;
