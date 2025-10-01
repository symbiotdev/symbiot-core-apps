import { CurrentBrandClients } from '@symbiot-core-apps/brand-client';
import React, { useLayoutEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { HeaderButton } from '@symbiot-core-apps/ui';

export default () => {
  const navigation = useNavigation();

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
      onClientPress={(client) => router.push(`/clients/${client.id}/update`)}
    />
  );
};
