import { HeaderButton, InitView } from '@symbiot-core-apps/ui';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
  useBrandMembershipProfileByIdQuery,
} from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { XStack } from 'tamagui';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandMembershipProfile } from '@symbiot-core-apps/brand-membership';
import { BrandMembershipItem } from '@symbiot-core-apps/brand';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandMembershipType;
  }>();
  const {
    data: membership,
    isPending,
    error,
  } = useBrandMembershipProfileByIdQuery(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`${getTranslateKeyByBrandMembershipType(type)}.profile.title`),
      headerRight: () => (
        <XStack gap="$3">
          {hasPermission('analyticsAll') && (
            <HeaderButton
              iconName="ChartSquare"
              onPress={() =>
                router.push(`/memberships/${type}/${id}/analytics`)
              }
            />
          )}
          {hasPermission('membershipsAll') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/memberships/${type}/${id}/update`)}
            />
          )}
        </XStack>
      ),
    });
  }, [hasPermission, id, type, navigation, t]);

  if (!membership || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <BrandMembershipProfile
      membership={membership}
      Item={<BrandMembershipItem alignSelf="center" membership={membership} />}
    />
  );
};
