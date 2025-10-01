import { CurrentBrandServices } from '@symbiot-core-apps/brand-service';
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
          onPress={() => router.push('/services/create')}
        />
      ),
    });
  }, [navigation]);

  return (
    <CurrentBrandServices
      onServicePress={(service) =>
        router.push(`/services/${service.id}/update`)
      }
    />
  );
};
