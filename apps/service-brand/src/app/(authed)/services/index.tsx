import { CurrentBrandServices } from '@symbiot-core-apps/brand-service';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { HeaderButton, useScreenHeaderHeight } from '@symbiot-core-apps/ui';
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
          onPress={tryAction('addService', () =>
            router.push('/services/create'),
          )}
        />
      ),
    });
  }, [tryAction, navigation]);

  return (
    <CurrentBrandServices
      offsetTop={headerHeight}
      onServicePress={(service) =>
        router.push(`/services/${service.id}/profile`)
      }
    />
  );
};
