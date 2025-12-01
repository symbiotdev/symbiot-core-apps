import { CurrentBrandClients } from '@symbiot-core-apps/brand-client';
import { router, useNavigation } from 'expo-router';
import { HeaderButton, useScreenHeaderHeight } from '@symbiot-core-apps/ui';
import React, { useLayoutEffect } from 'react';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();
  const { canDo } = useAccountLimits();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        canDo.addClient && (
          <HeaderButton
            iconName="AddCircle"
            onPress={() => router.push('/clients/create')}
          />
        ),
    });
  }, [canDo.addClient, navigation]);

  return (
    <CurrentBrandClients
      offsetTop={headerHeight}
      hideAddClientButton={!canDo.addClient}
      onClientPress={(client) => router.push(`/clients/${client.id}/profile`)}
    />
  );
};
