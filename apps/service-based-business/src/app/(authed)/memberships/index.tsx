import { CurrentBrandMemberships } from '@symbiot-core-apps/brand-membership';
import React, { useLayoutEffect } from 'react';
import { HeaderButton, useScreenHeaderHeight } from '@symbiot-core-apps/ui';
import { router, useNavigation } from 'expo-router';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();

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

  return (
    <CurrentBrandMemberships
      offsetTop={headerHeight}
      onMembershipPress={(membership) =>
        router.push(`/memberships/${membership.id}/profile`)
      }
    />
  );
};
