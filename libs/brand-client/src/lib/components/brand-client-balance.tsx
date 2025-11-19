import { View } from 'tamagui';
import {
  ActionCardWithCustomButton,
  AdaptivePopoverRef,
  Button,
  EmptyView,
  formViewStyles,
  Icon,
} from '@symbiot-core-apps/ui';
import React, { useRef } from 'react';
import { AnyBrandClientMembership, BrandClient } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { BrandClientMembershipItem } from '@symbiot-core-apps/brand';
import { BrandClientTopUpBalance } from './brand-client-top-up-balance';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

export const BrandClientBalance = ({
  client,
  showTopUpBalance,
  preventNavigationToCreatedMembership,
  showEmptyMessage,
  onPressMembership,
}: {
  client: BrandClient;
  showTopUpBalance?: boolean;
  preventNavigationToCreatedMembership?: boolean;
  showEmptyMessage?: boolean;
  onPressMembership: (membership: AnyBrandClientMembership) => void;
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useCurrentBrandEmployee();
  const topUpBalancePopoverRef = useRef<AdaptivePopoverRef>(null);

  return (
    <View gap="$2" alignItems="center">
      {hasPermission('catalog') && showTopUpBalance && (
        <ActionCardWithCustomButton
          style={formViewStyles}
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

      {client.memberships?.map((membership) => (
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
