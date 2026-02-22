import {
  AnyBrandClientMembership,
  BrandBooking,
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
  CompactView,
  compactViewStyles,
  EmptyView,
  InitView,
  ListItem,
  ListItemGroup,
  RegularText,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import React, { useCallback, useMemo, useRef } from 'react';
import { BrandClientItem } from '@symbiot-core-apps/brand';
import { useI18n, useModal } from '@symbiot-core-apps/shared';
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
import {
  AdaptiveSheet,
  AdaptiveSheetRef,
  Icon,
  PAGE_STYLE,
} from '@symbiot-core-apps/ui2';

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
  const { t } = useI18n();

  return (
    <BrandClientItem
      loading={loading}
      hideArrow={hideArrow}
      style={compactViewStyles}
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
  const { t } = useI18n();
  const { hasPermission } = useCurrentBrandEmployee();
  const { mutateAsync: addClient, isPending: clientAdding } =
    useAddServiceBrandBookingClientReq();
  const { upsertBookings } = useCurrentBrandBookingsState();
  const {
    visible: clientsModalVisible,
    open: openClientsModal,
    close: closeClientsModal,
  } = useModal();

  const sortedClients = useMemo(
    () =>
      booking.clients?.sort(
        (a, b) => new Date(b.cAt).getTime() - new Date(a.cAt).getTime(),
      ),
    [booking.clients],
  );

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

  return (
    <>
      <ListItemGroup
        title={`${t('service_brand_booking.profile.clients.title')} (${sortedClients.length}/${booking.places})`}
        titleProps={{
          ...(sortedClients?.length > booking.places && {
            color: '$error',
          }),
        }}
      >
        {!booking.cancelAt &&
          !!sortedClients.length &&
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

        {!sortedClients?.length ? (
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
          sortedClients.map((client) => (
            <Client key={client.id} client={client} booking={booking} />
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
          disabledIds={sortedClients.map(({ id }) => id)}
          onClientPress={onAdd}
        />
      </SlideSheetModal>
    </>
  );
};

const Client = ({
  client,
  booking,
}: {
  client: BrandBookingClient;
  booking: BrandBooking;
}) => {
  const { t } = useI18n();
  const { mutateAsync: updateClient, isPending: isUpdating } =
    useUpdateServiceBrandBookingClientReq();
  const { mutateAsync: removeClient, isPending: isRemoving } =
    useRemoveServiceBrandBookingClientReq();
  const {
    visible: clientBalanceModalVisible,
    open: openClientBalanceModal,
    close: closeClientBalanceModal,
  } = useModal();

  const sheetRef = useRef<AdaptiveSheetRef>(null);

  const onMarkAsFree = useCallback(() => {
    sheetRef.current?.hide();

    void updateClient({
      bookingId: booking.id,
      clientId: client.id,
      data: {
        free: true,
      },
    });
  }, [booking.id, client.id, updateClient]);

  const onRemove = useCallback(() => {
    sheetRef.current?.hide();

    void removeClient({
      bookingId: booking.id,
      clientId: client.id,
    });
  }, [booking.id, client.id, removeClient]);

  const onChangeMembership = useCallback(
    (membership: AnyBrandClientMembership) => {
      closeClientBalanceModal();
      sheetRef.current?.hide();
      void updateClient({
        bookingId: booking.id,
        clientId: client.id,
        data: {
          membership: membership.id,
        },
      });
    },
    [booking.id, client.id, closeClientBalanceModal, updateClient],
  );

  return (
    <AdaptiveSheet
      excludePaddings
      ref={sheetRef}
      trigger={
        <ClientItem
          paddingVertical="$1"
          key={client.id}
          hideArrow={!!booking.cancelAt}
          disabled={!!booking.cancelAt}
          loading={isUpdating || isRemoving}
          client={client}
        />
      }
    >
      <View minWidth={220} paddingHorizontal={20}>
        <ClientItem
          hideArrow
          marginTop="$5"
          paddingVertical="$2"
          client={client}
        />

        <View paddingLeft="$2" style={compactViewStyles}>
          <Br marginVertical="$2" />

          {!client.membership && (
            <ListItem
              label={t(
                `service_brand_booking.profile.clients.actions.use_balance.label`,
              )}
              icon={<Icon name="Wallet" />}
              onPress={openClientBalanceModal}
            />
          )}

          {!client.free && (
            <ListItem
              label={t(
                `service_brand_booking.profile.clients.actions.mark_as_free.label`,
              )}
              icon={<Icon name="Balloon" />}
              onPress={onMarkAsFree}
            />
          )}
          <ListItem
            label={t(
              `service_brand_booking.profile.clients.actions.profile.label`,
            )}
            icon={<Icon name="SmileCircle" />}
            onPress={() => {
              sheetRef.current?.hide();
              router.push(`/clients/${client.id}/profile`);
            }}
          />
          <ListItem
            color="$error"
            label={t(
              `service_brand_booking.profile.clients.actions.cancel_by_brand.label`,
            )}
            icon={<Icon name="TrashBinMinimalistic" />}
            onPress={onRemove}
          />
        </View>
      </View>

      <SlideSheetModal
        scrollable
        headerTitle={t(
          `service_brand_booking.profile.clients.actions.use_balance.label`,
        )}
        visible={clientBalanceModalVisible}
        onClose={closeClientBalanceModal}
      >
        <Balance
          id={client.id}
          membershipId={client.membership?.id}
          onPressMembership={onChangeMembership}
        />
      </SlideSheetModal>
    </AdaptiveSheet>
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
  const { t } = useI18n();
  const { data: client, error, isPending } = useBrandClientDetailedByIdReq(id);

  if (!client || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <CompactView paddingVertical={PAGE_STYLE.paddingVertical}>
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
    </CompactView>
  );
};
