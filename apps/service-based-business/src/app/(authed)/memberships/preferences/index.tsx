import { CurrentBrandMemberships } from '@symbiot-core-apps/brand-membership';
import React, { useLayoutEffect } from 'react';
import { HeaderButton } from '@symbiot-core-apps/ui';
import { router, useNavigation } from 'expo-router';

export default () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={() => router.push('/memberships/create')}
        />
      ),
    });
  }, [navigation]);

  return <CurrentBrandMemberships navigateTo="update" />;
};
