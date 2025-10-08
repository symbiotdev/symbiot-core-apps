import {
  BrandClient,
  BrandMembershipType,
  BrandPeriodBasedMembership,
  BrandVisitBasedMembership,
  useBrandClientAddMembershipQuery,
  useBrandPeriodBasedMembershipCurrentListQuery,
  useBrandVisitBasedMembershipCurrentListQuery,
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
    useBrandClientAddMembershipQuery();
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

  const onVisitBasedMembershipPress = useCallback(
    (membership: BrandVisitBasedMembership) => {
      void addMembership({
        clientId: client.id,
        membershipId: membership.id,
      });

      closeVisitBasedMembershipsModal();
    },
    [addMembership, client.id, closeVisitBasedMembershipsModal],
  );

  const onPeriodBasedMembershipPress = useCallback(
    (membership: BrandPeriodBasedMembership) => {
      void addMembership({
        clientId: client.id,
        membershipId: membership.id,
      });

      closePeriodBasedMembershipsModal();
    },
    [addMembership, client.id, closePeriodBasedMembershipsModal],
  );

  return (
    <>
      <AdaptivePopover
        placement="bottom"
        disabled={!hasPermission('catalogAll')}
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
          query={useBrandVisitBasedMembershipCurrentListQuery}
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
          query={useBrandPeriodBasedMembershipCurrentListQuery}
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
