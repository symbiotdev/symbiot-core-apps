import { CurrentBrandLocations } from '@symbiot-core-apps/brand-location';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { HeaderButton } from '@symbiot-core-apps/ui';

export default () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={() => router.push('/locations/create')}
        />
      ),
    });
  }, [navigation]);

  return (
    <CurrentBrandLocations
      onLocationPress={(location) =>
        router.push(`/locations/${location.id}/update`)
      }
    />
  );
};
