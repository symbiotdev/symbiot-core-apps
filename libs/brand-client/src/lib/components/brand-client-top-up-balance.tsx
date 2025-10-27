import {
  AnyBrandMembership,
  BrandClient,
  BrandMembershipType,
  BrandPeriodBasedMembership,
  BrandVisitBasedMembership,
  useBrandClientAddMembershipReq,
  useBrandPeriodBasedMembershipCurrentListReq,
  useBrandVisitBasedMembershipCurrentListReq,
} from '@symbiot-core-apps/api';
import React, { ReactElement, RefObject, useCallback } from 'react';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
  Icon,
  InitView,
  ListItem,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { View } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useApp } from '@symbiot-core-apps/app';
import { useModal } from '@symbiot-core-apps/shared';
import { BrandMembershipsCurrentList } from '@symbiot-core-apps/brand-membership';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandMembershipItem } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';

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
  const { hasPermission } = useCurrentBrandEmployee();
  const { mutateAsync: addMembership, isPending: isMembershipLoading } =
    useBrandClientAddMembershipReq();
  const {
    visible: visitBasedMembershipsModalVisible,
    open: openVisitBasedMembershipsModal,
    close: closeVisitBasedMembershipsModal,
  } = useModal({
    onOpen: () => popoverRef.current?.close(),
  });
  const {
    visible: periodBasedMembershipsModalVisible,
    open: openPeriodBasedMembershipsModal,
    close: closePeriodBasedMembershipsModal,
  } = useModal({
    onOpen: () => popoverRef.current?.close(),
  });

  const onAdd = useCallback(
    async (membership: AnyBrandMembership) => {
      const clientMembership = await addMembership({
        clientId: client.id,
        membershipId: membership.id,
      });

      router.push(
        `/clients/${client.id}/memberships/${clientMembership.id}/update`,
      );
    },
    [addMembership, client.id],
  );

  const onVisitBasedMembershipPress = useCallback(
    (membership: BrandVisitBasedMembership) => {
      void onAdd(membership);
      closeVisitBasedMembershipsModal();
    },
    [onAdd, closeVisitBasedMembershipsModal],
  );

  const onPeriodBasedMembershipPress = useCallback(
    (membership: BrandPeriodBasedMembership) => {
      void onAdd(membership);
      closePeriodBasedMembershipsModal();
    },
    [onAdd, closePeriodBasedMembershipsModal],
  );

  return (
    <>
      <AdaptivePopover
        placement="bottom"
        disabled={!hasPermission('catalog')}
        trigger={React.cloneElement(trigger, {
          loading: isMembershipLoading,
        })}
        ref={popoverRef}
        sheetTitle={t('brand_client.balance.top_up')}
      >
        <View>
          <ListItem
            label={t('brand_client.balance.menu.add_visit_based_membership')}
            icon={<Icon name={icons.VisitBasedMembership} />}
            onPress={openVisitBasedMembershipsModal}
          />
          <ListItem
            label={t('brand_client.balance.menu.add_period_based_membership')}
            icon={<Icon name={icons.PeriodBasedMembership} />}
            onPress={openPeriodBasedMembershipsModal}
          />
        </View>
      </AdaptivePopover>

      <SlideSheetModal
        paddingHorizontal={0}
        withKeyboard={false}
        headerTitle={t('brand_client.balance.menu.add_visit_based_membership')}
        visible={visitBasedMembershipsModalVisible}
        onClose={closeVisitBasedMembershipsModal}
      >
        <BrandMembershipsCurrentList
          type={BrandMembershipType.visits}
          query={useBrandVisitBasedMembershipCurrentListReq}
          renderItem={({ item }) => (
            <BrandMembershipItem
              alignSelf="center"
              membership={item}
              onPress={() =>
                onVisitBasedMembershipPress(item as BrandVisitBasedMembership)
              }
            />
          )}
          Intro={InitView}
        />
      </SlideSheetModal>

      <SlideSheetModal
        paddingHorizontal={0}
        withKeyboard={false}
        headerTitle={t('brand_client.balance.menu.add_period_based_membership')}
        visible={periodBasedMembershipsModalVisible}
        onClose={closePeriodBasedMembershipsModal}
      >
        <BrandMembershipsCurrentList
          type={BrandMembershipType.period}
          query={useBrandPeriodBasedMembershipCurrentListReq}
          renderItem={({ item }) => (
            <BrandMembershipItem
              alignSelf="center"
              membership={item}
              onPress={() =>
                onPeriodBasedMembershipPress(item as BrandPeriodBasedMembership)
              }
            />
          )}
          Intro={InitView}
        />
      </SlideSheetModal>
    </>
  );
};
