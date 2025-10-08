import { HeaderButton, InitView } from '@symbiot-core-apps/ui';
import {
  BrandPeriodBasedMembership,
  useBrandMembershipProfileByIdQuery,
} from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { XStack } from 'tamagui';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandMembershipProfile } from '@symbiot-core-apps/brand-membership';
import { BrandPeriodBasedMembershipItem } from '@symbiot-core-apps/brand';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: membership,
    isPending,
    error,
  } = useBrandMembershipProfileByIdQuery(id);
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack gap="$3">
          {hasPermission('analyticsAll') && (
            <HeaderButton
              iconName="ChartSquare"
              onPress={() => router.push(`/memberships/${id}/analytics`)}
            />
          )}
          {hasPermission('membershipsAll') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/memberships/${id}/update`)}
            />
          )}
        </XStack>
      ),
    });
  }, [hasPermission, id, navigation]);

  if (!membership || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <BrandMembershipProfile
      membership={membership}
      Item={
        <BrandPeriodBasedMembershipItem
          membership={membership as BrandPeriodBasedMembership}
        />
      }
    />
  );
};
