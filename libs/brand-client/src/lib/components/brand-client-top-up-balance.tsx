import {
  BrandClient,
  BrandMembership,
  BrandTicket,
  useBrandClientAddMembershipQuery,
  useBrandClientAddTicketQuery,
} from '@symbiot-core-apps/api';
import React, { ReactElement, RefObject, useCallback } from 'react';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
  Icon,
  ListItem,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { View } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useApp } from '@symbiot-core-apps/app';
import { useModal } from '@symbiot-core-apps/shared';
import { CurrentBrandTickets } from '@symbiot-core-apps/brand-ticket';
import { CurrentBrandMemberships } from '@symbiot-core-apps/brand-membership';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

export const BrandClientTopUpBalance = ({
  client,
  popoverRef,
  trigger,
}: {
  popoverRef: RefObject<AdaptivePopoverRef | null>;
  client: BrandClient;
  trigger: ReactElement<{ loading?: boolean }>;
}) => {
  const { icons } = useApp();
  const { t } = useTranslation();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();
  const {
    visible: ticketsModalVisible,
    open: openTicketsModal,
    close: closeTicketsModal,
  } = useModal({
    onOpen: () => popoverRef.current?.close(),
  });
  const { mutateAsync: addMembership, isPending: isMembershipLoading } =
    useBrandClientAddMembershipQuery();
  const { mutateAsync: addTicket, isPending: isTicketLoading } =
    useBrandClientAddTicketQuery();

  const {
    visible: membershipsModalVisible,
    open: openMembershipsModal,
    close: closeMembershipsModal,
  } = useModal({
    onOpen: () => popoverRef.current?.close(),
  });

  const onTicketPress = useCallback(
    (ticket: BrandTicket) => {
      void addTicket({ clientId: client.id, ticketId: ticket.id });

      closeTicketsModal();
    },
    [addTicket, client.id, closeTicketsModal],
  );

  const onMembershipPress = useCallback(
    (membership: BrandMembership) => {
      void addMembership({ clientId: client.id, membershipId: membership.id });

      closeMembershipsModal();
    },
    [addMembership, client.id, closeMembershipsModal],
  );

  return (
    <>
      <AdaptivePopover
        placement="bottom"
        disabled={hasAnyOfPermissions(['membershipsAll', 'ticketsAll'])}
        trigger={React.cloneElement(trigger, {
          loading: isMembershipLoading || isTicketLoading,
        })}
        ref={popoverRef}
        sheetTitle={t('brand_client.balance.top_up')}
      >
        <View>
          {hasPermission('ticketsAll') && (
            <ListItem
              label={t('brand_client.balance.menu.add_ticket')}
              icon={<Icon name={icons.Ticket} />}
              onPress={openTicketsModal}
            />
          )}

          {hasPermission('membershipsAll') && (
            <ListItem
              label={t('brand_client.balance.menu.add_membership')}
              icon={<Icon name={icons.Membership} />}
              onPress={openMembershipsModal}
            />
          )}
        </View>
      </AdaptivePopover>

      <SlideSheetModal
        paddingHorizontal={0}
        withKeyboard={false}
        headerTitle={t('brand_client.balance.menu.add_ticket')}
        visible={ticketsModalVisible}
        onClose={closeTicketsModal}
      >
        <CurrentBrandTickets onTicketPress={onTicketPress} />
      </SlideSheetModal>

      <SlideSheetModal
        paddingHorizontal={0}
        withKeyboard={false}
        headerTitle={t('brand_client.balance.menu.add_membership')}
        visible={membershipsModalVisible}
        onClose={closeMembershipsModal}
      >
        <CurrentBrandMemberships onMembershipPress={onMembershipPress} />
      </SlideSheetModal>
    </>
  );
};
