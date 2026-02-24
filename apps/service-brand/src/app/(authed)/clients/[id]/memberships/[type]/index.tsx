import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandMembershipType,
  useBrandClientDetailedByIdReq,
} from '@symbiot-core-apps/api';
import React, { useEffect } from 'react';
import { BrandClientMembershipsList } from '@symbiot-core-apps/brand-client';
import { BrandClientMembershipItem } from '@symbiot-core-apps/brand';
import { FallbackView, useHeaderHeight } from '@symbiot-core-apps/ui2';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandMembershipType;
  }>();
  const {
    data: client,
    error,
    isPending,
  } = useBrandClientDetailedByIdReq(id, false);

  useEffect(() => {
    if (client) {
      navigation.setOptions({
        headerTitle: `${client.firstname} ${client.lastname}`,
      });
    }
  }, [client, navigation]);

  if (!client || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return (
    <BrandClientMembershipsList
      clientId={id}
      type={type}
      offsetTop={headerHeight}
      renderItem={({ item }) => (
        <BrandClientMembershipItem alignSelf="center" membership={item} />
      )}
    />
  );
};
