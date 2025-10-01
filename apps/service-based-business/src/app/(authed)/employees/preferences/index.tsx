import { CurrentBrandEmployees } from '@symbiot-core-apps/brand-employee';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { HeaderButton, useScreenHeaderHeight } from '@symbiot-core-apps/ui';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={() => router.push('/employees/create')}
        />
      ),
    });
  }, [navigation]);

  return (
    <CurrentBrandEmployees
      offsetTop={headerHeight}
      onEmployeePress={(employee) =>
        router.push(`/employees/${employee.id}/update`)
      }
    />
  );
};
