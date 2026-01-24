import { CurrentBrandLocations } from '@symbiot-core-apps/brand-location';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { HeaderButton } from '@symbiot-core-apps/ui';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';

export default () => {
  const navigation = useNavigation();
  const { tryAction } = useAccountLimits();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={tryAction('addLocation', () =>
            router.push('/locations/create'),
          )}
        />
      ),
    });
  }, [tryAction, navigation]);

  return (
    <CurrentBrandLocations
      onLocationPress={(location) =>
        router.push(`/locations/${location.id}/profile`)
      }
    />
  );
};
