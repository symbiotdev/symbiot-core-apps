import {
  AnyBrandMembership,
  BrandClient,
  BrandMembershipType,
  useBrandClientAddMembershipReq,
  useBrandPeriodBasedMembershipCurrentListReq,
  useBrandVisitBasedMembershipCurrentListReq,
} from '@symbiot-core-apps/api';
import React, { ReactElement, RefObject, useCallback } from 'react';
import {
  Icon,
  InitView,
  ListItem,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { View } from 'tamagui';
import { useAppSettings } from '@symbiot-core-apps/app';
import { useI18n, useModal } from '@symbiot-core-apps/shared';
import { BrandMembershipsCurrentList } from '@symbiot-core-apps/brand-membership';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandMembershipItem } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';
import { AdaptiveSheet, AdaptiveSheetRef } from '@symbiot-core-apps/ui2';

export const BrandClientTopUpBalance = ({
  client,
  sheetRef,
  trigger,
  preventNavigationToProfile,
}: {
  sheetRef: RefObject<AdaptiveSheetRef | null>;
  client: BrandClient;
  trigger: ReactElement<{ loading?: boolean }>;
  preventNavigationToProfile?: boolean;
}) => {
  const { icons } = useAppSettings();
  const { t } = useI18n();
  const { hasPermission } = useCurrentBrandEmployee();
  const { mutateAsync: addMembership, isPending: isMembershipLoading } =
    useBrandClientAddMembershipReq();
  const {
    visible: visitBasedMembershipsModalVisible,
    open: openVisitBasedMembershipsModal,
    close: closeVisitBasedMembershipsModal,
  } = useModal({
    onClose: () => sheetRef.current?.hide(),
  });
  const {
    visible: periodBasedMembershipsModalVisible,
    open: openPeriodBasedMembershipsModal,
    close: closePeriodBasedMembershipsModal,
  } = useModal({
    onClose: () => sheetRef.current?.hide(),
  });

  const onAdd = useCallback(
    async (membership: AnyBrandMembership) => {
      const clientMembership = await addMembership({
        clientId: client.id,
        membershipId: membership.id,
      });

      if (preventNavigationToProfile) return;

      router.push(
        `/clients/${client.id}/memberships/${clientMembership.id}/update`,
      );
    },
    [addMembership, client.id, preventNavigationToProfile],
  );

  return (
    <AdaptiveSheet
      excludePaddings
      popoverPlacement="bottom"
      disabled={!hasPermission('catalog')}
      trigger={React.cloneElement(trigger, {
        loading: isMembershipLoading,
      })}
      ref={sheetRef}
      sheetTitle={t('brand_client.balance.top_up.title')}
    >
      <View paddingHorizontal={20} paddingVertical={10}>
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

      <SlideSheetModal
        withKeyboard={false}
        paddingHorizontal={0}
        headerTitle={t('brand_client.balance.menu.add_visit_based_membership')}
        visible={visitBasedMembershipsModalVisible}
        onClose={closeVisitBasedMembershipsModal}
      >
        <BrandMembershipsCurrentList
          withHidden={false}
          type={BrandMembershipType.visits}
          query={useBrandVisitBasedMembershipCurrentListReq}
          renderItem={({ item }) => (
            <BrandMembershipItem
              alignSelf="center"
              membership={item}
              onPress={(e) => {
                void onAdd(item);
                closeVisitBasedMembershipsModal(e);
              }}
            />
          )}
          Intro={({ loading, error }) => (
            <InitView
              loading={loading}
              error={error}
              noDataIcon={icons.VisitBasedMembership}
              noDataTitle={t(
                'brand_client.balance.top_up.visit_based_memberships.empty.title',
              )}
              noDataMessage={t(
                'brand_client.balance.top_up.visit_based_memberships.empty.subtitle',
              )}
            />
          )}
        />
      </SlideSheetModal>

      <SlideSheetModal
        withKeyboard={false}
        paddingHorizontal={0}
        headerTitle={t('brand_client.balance.menu.add_period_based_membership')}
        visible={periodBasedMembershipsModalVisible}
        onClose={closePeriodBasedMembershipsModal}
      >
        <BrandMembershipsCurrentList
          withHidden={false}
          type={BrandMembershipType.period}
          query={useBrandPeriodBasedMembershipCurrentListReq}
          renderItem={({ item }) => (
            <BrandMembershipItem
              alignSelf="center"
              membership={item}
              onPress={(e) => {
                void onAdd(item);
                closePeriodBasedMembershipsModal(e);
              }}
            />
          )}
          Intro={({ loading, error }) => (
            <InitView
              loading={loading}
              error={error}
              noDataIcon={icons.PeriodBasedMembership}
              noDataTitle={t(
                'brand_client.balance.top_up.period_based_memberships.empty.title',
              )}
              noDataMessage={t(
                'brand_client.balance.top_up.period_based_memberships.empty.subtitle',
              )}
            />
          )}
        />
      </SlideSheetModal>
    </AdaptiveSheet>
  );
};
