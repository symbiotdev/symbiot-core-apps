import { CurrentBrandClients } from '@symbiot-core-apps/brand-client';
import { router, useNavigation } from 'expo-router';
import { HeaderButton, useScreenHeaderHeight } from '@symbiot-core-apps/ui';
import React, { useLayoutEffect } from 'react';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={() => router.push('/clients/create')}
        />
      ),
    });
  }, [navigation]);

  return (
    <CurrentBrandClients
      offsetTop={headerHeight}
      onClientPress={(client) => router.push(`/clients/${client.id}/profile`)}
    />
  );
};
