import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandMembershipType,
  useBrandClientDetailedByIdQuery,
  useBrandClientPeriodBasedMembershipsListQuery,
  useBrandClientVisitsBasedMembershipsListQuery,
} from '@symbiot-core-apps/api';
import { InitView, useScreenHeaderHeight } from '@symbiot-core-apps/ui';
import React, { useEffect } from 'react';
import { BrandClientMembershipsList } from '@symbiot-core-apps/brand-client';
import { BrandClientMembershipItem } from '@symbiot-core-apps/brand';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandMembershipType;
  }>();
  const {
    data: client,
    error,
    isPending,
  } = useBrandClientDetailedByIdQuery(id, false);

  useEffect(() => {
    if (client) {
      navigation.setOptions({
        headerTitle: `${client.firstname} ${client.lastname}`,
      });
    }
  }, [client, navigation]);

  if (!client || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <BrandClientMembershipsList
      clientId={id}
      offsetTop={headerHeight}
      query={
        type === BrandMembershipType.period
          ? useBrandClientPeriodBasedMembershipsListQuery
          : useBrandClientVisitsBasedMembershipsListQuery
      }
      renderItem={({ item }) => (
        <BrandClientMembershipItem alignSelf="center" membership={item} />
      )}
    />
  );
};
