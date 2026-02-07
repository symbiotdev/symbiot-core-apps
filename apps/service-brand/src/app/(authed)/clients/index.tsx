import { CurrentBrandClients } from '@symbiot-core-apps/brand-client';
import { router, useNavigation } from 'expo-router';
import { HeaderButton, useScreenHeaderHeight } from '@symbiot-core-apps/ui';
import React, { useLayoutEffect } from 'react';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';
import { XStack } from 'tamagui';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();
  const { tryAction } = useAccountLimits();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack gap="$2">
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
        </XStack>
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
