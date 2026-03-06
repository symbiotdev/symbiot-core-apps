import {
  getTranslateKeyByBrandMembershipType,
  useBrandMembershipProfileByIdReq,
} from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandMembershipProfile } from '@symbiot-core-apps/brand-membership';
import { BrandMembershipItem } from '@symbiot-core-apps/brand';
import { useI18n } from '@symbiot-core-apps/shared';
import { FallbackView, HeaderButton } from '@symbiot-core-apps/ui2';

export default () => {
  const { t } = useI18n();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const {
    data: membership,
    isPending,
    error,
  } = useBrandMembershipProfileByIdReq(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: membership?.type
        ? t(
            `${getTranslateKeyByBrandMembershipType(membership.type)}.profile.title`,
          )
        : '',
      ...(hasPermission('catalog') && {
        headerRight: () => (
          <>
            {/*todo - analytics*/}
            {/*{hasPermission('analytics') && (*/}
            {/*  <HeaderButton*/}
            {/*    iconName="ChartSquare"*/}
            {/*    onPress={() =>*/}
            {/*      router.push(`/memberships/${id}/analytics`)*/}
            {/*    }*/}
            {/*  />*/}
            {/*)}*/}
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/memberships/${id}/update`)}
            />
          </>
        ),
      }),
    });
  }, [hasPermission, id, membership?.type, navigation, t]);

  if (!membership || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return (
    <BrandMembershipProfile
      membership={membership}
      Item={<BrandMembershipItem alignSelf="center" membership={membership} />}
    />
  );
};
