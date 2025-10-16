import { View } from 'tamagui';
import {
  ActionCardWithCustomButton,
  AdaptivePopoverRef,
  Button,
  Icon,
} from '@symbiot-core-apps/ui';
import React, { useCallback, useRef } from 'react';
import { AnyBrandClientMembership, BrandClient } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { BrandClientMembershipItem } from '@symbiot-core-apps/brand';
import { BrandClientTopUpBalance } from './brand-client-top-up-balance';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { router } from 'expo-router';

export const BrandClientBalance = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
  const { hasPermission } = useCurrentBrandEmployee();
  const topUpBalancePopoverRef = useRef<AdaptivePopoverRef>(null);

  const onPressMembership = useCallback(
    (membership: AnyBrandClientMembership) => {
      router.push(`/clients/${client.id}/memberships/${membership.id}/update`);
    },
    [client.id],
  );

  return (
    <View gap="$2" alignItems="center">
      {!client.memberships?.length && (
        <ActionCardWithCustomButton
          title={t('brand_client.balance.extend.title')}
          subtitle={t('brand_client.balance.extend.subtitle')}
          button={
            <BrandClientTopUpBalance
              client={client}
              popoverRef={topUpBalancePopoverRef}
              trigger={
                <Button
                  icon={<Icon name="Wallet" />}
                  label={t('brand_client.balance.extend.button.label')}
                />
              }
            />
          }
        />
      )}

      {hasPermission('catalogAll') &&
        client.memberships?.map((membership) => (
          <BrandClientMembershipItem
            alignSelf="center"
            key={membership.id}
            membership={membership}
            onPress={() => onPressMembership(membership)}
          />
        ))}
    </View>
  );
};
