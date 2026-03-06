import { useBrandServiceProfileByIdReq } from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandServiceProfile } from '@symbiot-core-apps/brand-service';
import { FallbackView, HeaderButton } from '@symbiot-core-apps/ui2';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: service, isPending, error } = useBrandServiceProfileByIdReq(id);
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      ...(hasPermission('catalog') && {
        headerRight: () => (
          <>
            {/*todo - analytics*/}
            {/*{hasPermission('analytics') && (*/}
            {/*  <HeaderButton*/}
            {/*    iconName="ChartSquare"*/}
            {/*    onPress={() => router.push(`/services/${id}/analytics`)}*/}
            {/*  />*/}
            {/*)}*/}
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/services/${id}/update`)}
            />
          </>
        ),
      }),
    });
  }, [hasPermission, id, navigation]);

  if (!service || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <BrandServiceProfile service={service} />;
};
