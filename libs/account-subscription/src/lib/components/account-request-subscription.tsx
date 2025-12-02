import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { ActionCard, Icon } from '@symbiot-core-apps/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountSubscription } from '../providers/account-subscription-provider';

export const AccountRequestSubscription = () => {
  const { t } = useTranslation();
  const { me } = useCurrentAccountState();
  const { brand } = useCurrentBrandState();
  const { currentEmployee } = useCurrentBrandEmployee();
  const { packages, showPaywall } = useAccountSubscription();

  if (
    !me?.offering ||
    !packages.length ||
    !brand ||
    currentEmployee?.id !== brand.owner?.id ||
    (brand?.subscription && brand.subscription.renewable)
  )
    return null;

  return (
    <ActionCard
      title={t('subscription.card.title')}
      subtitle={t('subscription.card.subtitle')}
      buttonLabel={t('subscription.card.button.label')}
      buttonIcon={<Icon name="Rocket" />}
      onPress={showPaywall}
    />
  );
};
