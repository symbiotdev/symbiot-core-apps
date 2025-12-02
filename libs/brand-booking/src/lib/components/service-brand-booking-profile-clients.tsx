import {
  AnyBrandClientMembership,
  BrandBookingClient,
  BrandClient,
  ServiceBrandBooking,
  useAddServiceBrandBookingClientReq,
  useBrandClientDetailedByIdReq,
  useRemoveServiceBrandBookingClientReq,
  useUpdateServiceBrandBookingClientReq,
} from '@symbiot-core-apps/api';
import {
  ActionCard,
  Br,
  Button,
  defaultPageVerticalPadding,
  EmptyView,
  FormView,
  formViewStyles,
  Icon,
  InitView,
  ListItem,
  ListItemGroup,
  RegularText,
  Sheet,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrandClientItem } from '@symbiot-core-apps/brand';
import { useModal } from '@symbiot-core-apps/shared';
import {
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import {
  BrandClientBalance,
  CurrentBrandClients,
} from '@symbiot-core-apps/brand-client';
import { router } from 'expo-router';
import { View, ViewProps } from 'tamagui';

const ClientItem = ({
  client,
  hideArrow,
  loading,
  ...viewProps
}: ViewProps & {
  client: BrandBookingClient;
  hideArrow?: boolean;
  loading?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <BrandClientItem
      loading={loading}
      hideArrow={hideArrow}
      style={formViewStyles}
      client={client}
      subtitleColor={!client.membership && !client.free ? '$error' : undefined}
      subtitle={
        client.free
          ? t(`service_brand_booking.profile.clients.free_visit`)
          : client.membership?.name ||
            t(`service_brand_booking.profile.clients.need_pay`)
      }
      {...viewProps}
    />
  );
};

export const ServiceBrandBookingProfileClients = ({
  booking,
}: {
  booking: ServiceBrandBooking;
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useCurrentBrandEmployee();
  const { mutateAsync: addClient, isPending: clientAdding } =
    useAddServiceBrandBookingClientReq();
  const { mutateAsync: removeClient } = useRemoveServiceBrandBookingClientReq();
  const { mutateAsync: updateClient } = useUpdateServiceBrandBookingClientReq();
  const { upsertBookings } = useCurrentBrandBookingsState();
  const {
    visible: clientsModalVisible,
    open: openClientsModal,
    close: closeClientsModal,
  } = useModal();
  const {
    visible: clientBalanceModalVisible,
    open: openClientBalanceModal,
    close: closeClientBalanceModal,
  } = useModal();

  const [actionClient, setActionClient] = useState<BrandBookingClient>();
  const [loadingId, setLoadingId] = useState<string>();

  const onAdd = useCallback(
    async (client: BrandClient) => {
      closeClientsModal();

      const newBooking = await addClient({
        bookingId: booking.id,
        data: { id: client.id, free: false, note: '' },
      });

      upsertBookings([newBooking]);
    },
    [addClient, booking.id, closeClientsModal, upsertBookings],
  );

  const onRemove = useCallback(
    async (client: BrandClient) => {
      setLoadingId(client.id);

      try {
        await removeClient({
          bookingId: booking.id,
          clientId: client.id,
        });
      } finally {
        setLoadingId(undefined);
      }
    },
    [booking.id, removeClient],
  );

  const onChangeMembership = useCallback(
    async (client: BrandClient, membership: string) => {
      setLoadingId(client.id);

      try {
        await updateClient({
          bookingId: booking.id,
          clientId: client.id,
          data: {
            membership,
          },
        });
      } finally {
        setLoadingId(undefined);
      }
    },
    [booking.id, updateClient],
  );

  const onMarkAsFree = useCallback(
    async (client: BrandClient) => {
      setLoadingId(client.id);

      try {
        await updateClient({
          bookingId: booking.id,
          clientId: client.id,
          data: {
            free: true,
          },
        });
      } finally {
        setLoadingId(undefined);
      }
    },
    [booking.id, updateClient],
  );

  return (
    <>
      <ListItemGroup
        title={`${t('service_brand_booking.profile.clients.title')} (${booking.clients.length}/${booking.places})`}
        titleProps={{
          ...(booking.clients.length > booking.places && {
            color: '$error',
          }),
        }}
      >
        {!booking.cancelAt &&
          !!booking.clients.length &&
          hasPermission('bookings') && (
            <Button
              loading={clientAdding}
              type="clear"
              minHeight="auto"
              width="auto"
              fontSize={14}
              color="$link"
              paddingVertical={0}
              position="absolute"
              right={0}
              top={-24}
              paddingHorizontal="$4"
              label={t(`service_brand_booking.profile.clients.add`)}
              onPress={openClientsModal}
            />
          )}

        {!booking.clients?.length ? (
          !hasPermission('bookings') ? (
            <EmptyView
              message={t(`service_brand_booking.profile.clients.empty`)}
            />
          ) : (
            <ActionCard
              title={t('service_brand_booking.profile.add_first_client.title')}
              subtitle={t(
                'service_brand_booking.profile.add_first_client.subtitle',
              )}
              buttonLabel={t(
                'service_brand_booking.profile.add_first_client.button.label',
              )}
              buttonLoading={clientAdding}
              onPress={openClientsModal}
            />
          )
        ) : (
          booking.clients
            .sort((a, b) => (a.firstname > b.firstname ? 1 : -1))
            .map((client) => (
              <ClientItem
                paddingVertical="$1"
                key={client.id}
                hideArrow={!!booking.cancelAt}
                disabled={!!booking.cancelAt}
                loading={loadingId === client.id}
                client={client}
                onPress={() => setActionClient(client)}
              />
            ))
        )}
      </ListItemGroup>

      <SlideSheetModal
        withKeyboard={false}
        paddingHorizontal={0}
        headerTitle={t(`service_brand_booking.profile.clients.title`)}
        visible={clientsModalVisible}
        onClose={closeClientsModal}
      >
        <CurrentBrandClients
          hideArrow
          hideAddClientButton
          disabledIds={booking.clients.map(({ id }) => id)}
          onClientPress={onAdd}
        />
      </SlideSheetModal>

      <SlideSheetModal
        scrollable
        headerTitle={t(
          `service_brand_booking.profile.clients.actions.use_balance.label`,
        )}
        visible={clientBalanceModalVisible}
        onClose={closeClientBalanceModal}
      >
        {!!actionClient && (
          <Balance
            id={actionClient.id}
            membershipId={actionClient.membership?.id}
            onPressMembership={(membership) => {
              closeClientBalanceModal();
              setActionClient(undefined);
              void onChangeMembership(actionClient, membership.id);
            }}
          />
        )}
      </SlideSheetModal>

      <Sheet
        opened={!!actionClient && !clientBalanceModalVisible}
        onClose={() => setActionClient(undefined)}
      >
        {!!actionClient && (
          <ClientItem hideArrow paddingVertical="$2" client={actionClient} />
        )}

        <Br style={formViewStyles} />

        <View paddingLeft="$2" style={formViewStyles}>
          <ListItem
            label={t(
              `service_brand_booking.profile.clients.actions.use_balance.label`,
            )}
            icon={<Icon name="Wallet" />}
            onPress={openClientBalanceModal}
          />
          {!actionClient?.free && (
            <ListItem
              label={t(
                `service_brand_booking.profile.clients.actions.mark_as_free.label`,
              )}
              icon={<Icon name="Balloon" />}
              onPress={() => {
                void onMarkAsFree(actionClient as BrandBookingClient);
                setActionClient(undefined);
              }}
            />
          )}
          <ListItem
            label={t(
              `service_brand_booking.profile.clients.actions.profile.label`,
            )}
            icon={<Icon name="SmileCircle" />}
            onPress={() => {
              setActionClient(undefined);
              router.push(`/clients/${actionClient?.id}/profile`);
            }}
          />
          <ListItem
            color="$error"
            label={t(
              `service_brand_booking.profile.clients.actions.cancel_by_brand.label`,
            )}
            icon={<Icon name="TrashBinMinimalistic" />}
            onPress={() => {
              void onRemove(actionClient as BrandBookingClient);
              setActionClient(undefined);
            }}
          />
        </View>
      </Sheet>
    </>
  );
};

const Balance = ({
  id,
  onPressMembership,
  membershipId,
}: {
  id: string;
  membershipId?: string;
  onPressMembership: (membership: AnyBrandClientMembership) => void;
}) => {
  const { t } = useTranslation();
  const { data: client, error, isPending } = useBrandClientDetailedByIdReq(id);

  if (!client || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <FormView paddingVertical={defaultPageVerticalPadding}>
      <RegularText flex={1}>
        {t(`service_brand_booking.profile.clients.actions.use_balance.info`)}
      </RegularText>

      <BrandClientBalance
        preventNavigationToCreatedMembership
        client={client}
        showTopUpBalance={!client.memberships?.length}
        disabledIds={membershipId ? [membershipId] : []}
        onPressMembership={onPressMembership}
      />
    </FormView>
  );
};
