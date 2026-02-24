import { CurrentBrandClients } from '@symbiot-core-apps/brand-client';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';
import { HeaderButton, useHeaderHeight } from '@symbiot-core-apps/ui2';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const { tryAction } = useAccountLimits();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <HeaderButton
            iconName="Import"
            onPress={tryAction('importClients', () =>
              router.push('/clients/import'),
            )}
          />
          <HeaderButton
            iconName="AddCircle"
            onPress={tryAction('addClient', () =>
              router.push('/clients/create'),
            )}
          />
        </>
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
