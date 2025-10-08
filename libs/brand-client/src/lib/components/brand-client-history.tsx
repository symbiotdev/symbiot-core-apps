import { BrandClient, BrandMembershipType } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { useApp } from '@symbiot-core-apps/app';
import { Icon, ListItem, ListItemGroup } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import React from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

export const BrandClientHistory = ({ client }: { client: BrandClient }) => {
  const { icons } = useApp();
  const { t } = useTranslation();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();

  return (
    hasAnyOfPermissions(['catalogAll', 'financesAll']) && (
      <ListItemGroup title={t('brand_client.history.title')}>
        {hasPermission('catalogAll') && (
          <>
            <ListItem
              label={t('brand_client.history.menu.visit_based_memberships')}
              icon={<Icon name={icons.VisitBasedMembership} />}
              iconAfter={<Icon name="ArrowRight" />}
              onPress={() =>
                router.push(
                  `/clients/${client.id}/memberships/${BrandMembershipType.visits}`,
                )
              }
            />
            <ListItem
              label={t('brand_client.history.menu.period_based_memberships')}
              icon={<Icon name={icons.PeriodBasedMembership} />}
              iconAfter={<Icon name="ArrowRight" />}
              onPress={() =>
                router.push(
                  `/clients/${client.id}/memberships/${BrandMembershipType.period}`,
                )
              }
            />
          </>
        )}

        {hasPermission('financesAll') && (
          <ListItem
            label={t('brand_client.history.menu.transactions')}
            icon={<Icon name="Bill" />}
            iconAfter={<Icon name="ArrowRight" />}
            onPress={() => router.push(`/clients/${client.id}/transactions`)}
          />
        )}
      </ListItemGroup>
    )
  );
};
