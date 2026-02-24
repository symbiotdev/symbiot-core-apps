import { BrandClientProfile } from '@symbiot-core-apps/brand-client';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useBrandClientDetailedByIdReq } from '@symbiot-core-apps/api';
import React, { useLayoutEffect } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { FallbackView, HeaderButton } from '@symbiot-core-apps/ui2';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const { data: client, error, isPending } = useBrandClientDetailedByIdReq(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {/*todo - analytics*/}
          {/*{hasPermission('analytics') && (*/}
          {/*  <HeaderButton*/}
          {/*    iconName="ChartSquare"*/}
          {/*    onPress={() => router.push(`/clients/${id}/analytics`)}*/}
          {/*  />*/}
          {/*)}*/}
          {hasPermission('clients') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/clients/${id}/update`)}
            />
          )}
        </>
      ),
    });
  }, [hasPermission, id, navigation]);

  if (!client || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <BrandClientProfile client={client} />;
};
