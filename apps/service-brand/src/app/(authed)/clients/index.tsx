import { CurrentBrandClients } from '@symbiot-core-apps/brand-client';
import { router, useNavigation } from 'expo-router';
import { HeaderButton, useScreenHeaderHeight } from '@symbiot-core-apps/ui';
import React, { useLayoutEffect } from 'react';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();
  const { tryAction } = useAccountLimits();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={tryAction('addClient', () => router.push('/clients/create'))}
        />
      ),
    });
  }, [tryAction, navigation]);

  return (
    <CurrentBrandClients
      offsetTop={headerHeight}
      onClientPress={(client) => router.push(`/clients/${client.id}/profile`)}
    />
  );
};
