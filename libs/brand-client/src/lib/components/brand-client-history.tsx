import { BrandClient, BrandMembershipType } from '@symbiot-core-apps/api';
import { useAppSettings } from '@symbiot-core-apps/app';
import { Icon, ListItem, ListItemGroup } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import React from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { useI18n } from '@symbiot-core-apps/shared';

export const BrandClientHistory = ({ client }: { client: BrandClient }) => {
  const { icons } = useAppSettings();
  const { t } = useI18n();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();

  return (
    hasAnyOfPermissions(['catalog', 'finances']) && (
      <ListItemGroup title={t('brand_client.history.title')}>
        {hasPermission('catalog') && (
          <>
            <ListItem
              label={t('brand_client.history.menu.visit_based_memberships')}
              icon={<Icon name={icons.VisitBasedMembership} />}
              onPress={() =>
                router.push(
                  `/clients/${client.id}/memberships/${BrandMembershipType.visits}`,
                )
              }
            />
            <ListItem
              label={t('brand_client.history.menu.period_based_memberships')}
              icon={<Icon name={icons.PeriodBasedMembership} />}
              onPress={() =>
                router.push(
                  `/clients/${client.id}/memberships/${BrandMembershipType.period}`,
                )
              }
            />
          </>
        )}

        {hasPermission('finances') && (
          <ListItem
            label={t('brand_client.history.menu.transactions')}
            icon={<Icon name="Bill" />}
            onPress={() => router.push(`/clients/${client.id}/transactions`)}
          />
        )}
      </ListItemGroup>
    )
  );
};
