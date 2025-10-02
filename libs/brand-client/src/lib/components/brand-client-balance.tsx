import { View } from 'tamagui';
import {
  ActionCardWithCustomButton,
  AdaptivePopoverRef,
  Button,
  Icon,
} from '@symbiot-core-apps/ui';
import React, { useRef } from 'react';
import { BrandClient } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import {
  BrandMembershipItemView,
  BrandTicketItemView,
} from '@symbiot-core-apps/brand';
import { BrandClientTopUpBalance } from './brand-client-top-up-balance';

export const BrandClientBalance = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
  const popoverRef = useRef<AdaptivePopoverRef>(null);

  return (
    <View gap="$1" alignItems="center">
      {!client.memberships?.length && !client.tickets?.length && (
        <ActionCardWithCustomButton
          title={t('brand_client.balance.extend.title')}
          subtitle={t('brand_client.balance.extend.subtitle')}
          button={
            <BrandClientTopUpBalance
              client={client}
              popoverRef={popoverRef}
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

      {client.memberships?.map((membership) => (
        <BrandMembershipItemView
          key={membership.id}
          name={membership.name}
          period={membership.period}
          price={membership.price}
          discount={membership.discount}
          currency={membership.currency}
          locations={membership.locations}
          endAt={membership.endAt}
        />
      ))}

      {client.tickets?.map((ticket) => (
        <BrandTicketItemView
          key={ticket.id}
          name={ticket.name}
          visits={ticket.visits}
          price={ticket.price}
          discount={ticket.discount}
          currency={ticket.currency}
          locations={ticket.locations}
        />
      ))}
    </View>
  );
};
