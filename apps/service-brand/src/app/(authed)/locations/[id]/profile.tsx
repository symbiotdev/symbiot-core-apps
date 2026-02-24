import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { useBrandLocationByIdReq } from '@symbiot-core-apps/api';
import { BrandLocationProfile } from '@symbiot-core-apps/brand-location';
import { FallbackView, HeaderButton } from '@symbiot-core-apps/ui2';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const { data: location, isPending, error } = useBrandLocationByIdReq(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {/*todo - analytics*/}
          {/*{hasPermission('analytics') && (*/}
          {/*  <HeaderButton*/}
          {/*    iconName="ChartSquare"*/}
          {/*    onPress={() => router.push(`/locations/${id}/analytics`)}*/}
          {/*  />*/}
          {/*)}*/}
          {hasPermission('locations') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/locations/${id}/update`)}
            />
          )}
        </>
      ),
    });
  }, [hasPermission, id, navigation]);

  if (!location) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <BrandLocationProfile location={location} />;
};
