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
  Br,
  Button,
  Card,
  defaultPageVerticalPadding,
  EmptyView,
  FormView,
  formViewStyles,
  Icon,
  InitView,
  ListItem,
  ListItemGroup,
  MediumText,
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
import { View } from 'tamagui';

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

  return (
    <>
      <ListItemGroup
        title={`${t(booking.clients.length > booking.places ? `service_brand_booking.profile.clients.overbooking` : 'service_brand_booking.profile.clients.title')} (${booking.clients.length}/${booking.places})`}
      >
        {hasPermission('bookings') && (
          <Button
            loading={clientAdding}
            type="clear"
            minHeight="auto"
            width="auto"
            fontSize={14}
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
          <EmptyView
            message={t(`service_brand_booking.profile.clients.empty`)}
          />
        ) : (
          booking.clients
            .sort((a, b) => (a.firstname > b.firstname ? 1 : -1))
            .map((client) => (
              <BrandClientItem
                paddingVertical="$1"
                key={client.id}
                loading={loadingId === client.id}
                client={client}
                subtitleColor={!client.membership ? '$error' : undefined}
                subtitle={
                  client.membership?.name ||
                  t(`service_brand_booking.profile.clients.need_pay`)
                }
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
          <BrandClientItem
            hideArrow
            paddingBottom="$2"
            style={formViewStyles}
            client={actionClient}
            subtitleColor={!actionClient.membership ? '$error' : undefined}
            subtitle={
              actionClient.membership?.name ||
              t(`service_brand_booking.profile.clients.need_pay`)
            }
          />
        )}

        <Br style={formViewStyles} />

        <View paddingLeft="$2">
          <ListItem
            label={t(
              `service_brand_booking.profile.clients.actions.profile.label`,
            )}
            style={formViewStyles}
            icon={<Icon name="SmileCircle" />}
            onPress={() => {
              setActionClient(undefined);
              router.push(`/clients/${actionClient?.id}/profile`);
            }}
          />
          <ListItem
            label={t(
              `service_brand_booking.profile.clients.actions.use_balance.label`,
            )}
            style={formViewStyles}
            icon={<Icon name="Wallet" />}
            onPress={openClientBalanceModal}
          />
          <ListItem
            color="$error"
            label={t(
              `service_brand_booking.profile.clients.actions.cancel_by_brand.label`,
            )}
            style={formViewStyles}
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
}: {
  id: string;
  onPressMembership: (membership: AnyBrandClientMembership) => void;
}) => {
  const { t } = useTranslation();
  const { data: client, error, isPending } = useBrandClientDetailedByIdReq(id);

  if (!client || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <FormView paddingVertical={defaultPageVerticalPadding}>
      <Card
        alignItems="center"
        gap="$2"
        marginVertical="$2"
        flexDirection="row"
      >
        <Icon name="InfoCircle" />
        <MediumText flex={1}>
          {t(`service_brand_booking.profile.clients.actions.use_balance.info`)}
        </MediumText>
      </Card>

      <BrandClientBalance
        showEmptyMessage
        showTopUpBalance
        preventNavigationToCreatedMembership
        client={client}
        onPressMembership={onPressMembership}
      />
    </FormView>
  );
};
