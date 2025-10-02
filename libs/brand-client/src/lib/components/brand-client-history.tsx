import { BrandClient } from '@symbiot-core-apps/api';
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
    hasAnyOfPermissions(['ticketsAll', 'membershipsAll', 'financesAll']) && (
      <ListItemGroup title={t('brand_client.history.title')}>
        {hasPermission('ticketsAll') && (
          <ListItem
            label={t('brand_client.history.menu.tickets')}
            icon={<Icon name={icons.Ticket} />}
            iconAfter={<Icon name="ArrowRight" />}
            onPress={() => router.push(`/clients/${client.id}/tickets`)}
          />
        )}

        {hasPermission('membershipsAll') && (
          <ListItem
            label={t('brand_client.history.menu.memberships')}
            icon={<Icon name={icons.Membership} />}
            iconAfter={<Icon name="ArrowRight" />}
            onPress={() => router.push(`/clients/${client.id}/memberships`)}
          />
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
