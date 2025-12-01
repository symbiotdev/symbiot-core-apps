import { CustomerInfo } from 'react-native-purchases';
import {
  AccountSubscription,
  AccountSubscriptionEnvironment,
} from '@symbiot-core-apps/api';
import { DateHelper } from '@symbiot-core-apps/shared';

export const mapCustomerInfoToAccountSubscription = (
  customerInfo: CustomerInfo,
): AccountSubscription | undefined => {
  if (!customerInfo.activeSubscriptions.length) return undefined;

  const subscription =
    customerInfo.subscriptionsByProductIdentifier[
      customerInfo.activeSubscriptions[0]
    ];

  if (!subscription) return undefined;

  return {
    store: subscription.store,
    product: subscription.productIdentifier,
    active: subscription.isActive,
    renewable: subscription.willRenew,
    expiresDate: subscription.expiresDate,
    environment: subscription.isSandbox
      ? AccountSubscriptionEnvironment.sandbox
      : AccountSubscriptionEnvironment.production,
  };
};

export const hasActiveSubscriptionChanges = (
  customerInfo: CustomerInfo,
  accountSubscription?: AccountSubscription,
) => {
  const activeSubscription = mapCustomerInfoToAccountSubscription(customerInfo);

  if (!activeSubscription && !accountSubscription) return false;

  return (
    activeSubscription?.store !== accountSubscription?.store ||
    activeSubscription?.active !== accountSubscription?.active ||
    activeSubscription?.product !== accountSubscription?.product ||
    activeSubscription?.renewable !== accountSubscription?.renewable ||
    (activeSubscription?.expiresDate && accountSubscription?.expiresDate
      ? !DateHelper.isSame(
          activeSubscription.expiresDate,
          accountSubscription.expiresDate,
        )
      : activeSubscription?.expiresDate !== accountSubscription?.expiresDate)
  );
};
