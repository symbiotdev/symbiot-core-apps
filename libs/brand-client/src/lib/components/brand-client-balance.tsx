import { View } from 'tamagui';
import {
  ActionCardWithCustomButton,
  AdaptivePopoverRef,
  Button,
  EmptyView,
  compactViewStyles,
  Icon,
} from '@symbiot-core-apps/ui';
import React, { useRef } from 'react';
import { AnyBrandClientMembership, BrandClient } from '@symbiot-core-apps/api';
import { BrandClientMembershipItem } from '@symbiot-core-apps/brand';
import { BrandClientTopUpBalance } from './brand-client-top-up-balance';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { DateHelper, useI18n } from '@symbiot-core-apps/shared';

export const BrandClientBalance = ({
  client,
  showTopUpBalance,
  disabledIds,
  preventNavigationToCreatedMembership,
  showEmptyMessage,
  onPressMembership,
}: {
  client: BrandClient;
  showTopUpBalance?: boolean;
  disabledIds?: string[];
  preventNavigationToCreatedMembership?: boolean;
  showEmptyMessage?: boolean;
  onPressMembership: (membership: AnyBrandClientMembership) => void;
}) => {
  const { t } = useI18n();
  const { hasPermission } = useCurrentBrandEmployee();
  const topUpBalancePopoverRef = useRef<AdaptivePopoverRef>(null);

  return (
    <View gap="$2" alignItems="center">
      {hasPermission('catalog') && showTopUpBalance && (
        <ActionCardWithCustomButton
          style={compactViewStyles}
          title={t('brand_client.balance.extend.title')}
          subtitle={t('brand_client.balance.extend.subtitle')}
          button={
            <BrandClientTopUpBalance
              client={client}
              preventNavigationToProfile={preventNavigationToCreatedMembership}
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

      {showEmptyMessage && !client.memberships?.length && (
        <EmptyView message={t('brand_client.balance.empty')} />
      )}

      {client.memberships
        ?.sort((a, b) => (DateHelper.isAfter(b.cAt, a.cAt) ? 1 : -1))
        ?.map((membership) => (
          <BrandClientMembershipItem
            alignSelf="center"
            key={membership.id}
            membership={membership}
            disabled={disabledIds?.includes(membership.id)}
            onPress={() => onPressMembership(membership)}
          />
        ))}
    </View>
  );
};
