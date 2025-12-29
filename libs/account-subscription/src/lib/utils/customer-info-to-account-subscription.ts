import { CustomerInfo } from 'react-native-purchases';
import {
  AccountSubscription,
  AccountSubscriptionEnvironment,
  currentSubscriptionType,
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
    type: currentSubscriptionType,
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
  const targetSubscription = mapCustomerInfoToAccountSubscription(customerInfo);

  if (!targetSubscription && !accountSubscription) return false;

  return (
    targetSubscription?.type !== accountSubscription?.type ||
    targetSubscription?.store !== accountSubscription?.store ||
    targetSubscription?.active !== accountSubscription?.active ||
    targetSubscription?.product !== accountSubscription?.product ||
    targetSubscription?.renewable !== accountSubscription?.renewable ||
    (targetSubscription?.expiresDate && accountSubscription?.expiresDate
      ? !DateHelper.isSame(
          targetSubscription.expiresDate,
          accountSubscription.expiresDate,
        )
      : targetSubscription?.expiresDate !== accountSubscription?.expiresDate)
  );
};
