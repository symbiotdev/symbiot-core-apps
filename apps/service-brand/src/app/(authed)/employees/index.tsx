import { CurrentBrandEmployees } from '@symbiot-core-apps/brand-employee';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { HeaderButton, useScreenHeaderHeight } from '@symbiot-core-apps/ui';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();
  const { canDo } = useAccountLimits();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        canDo.addEmployee && (
          <HeaderButton
            iconName="AddCircle"
            onPress={() => router.push('/employees/create')}
          />
        ),
    });
  }, [canDo.addEmployee, navigation]);

  return (
    <CurrentBrandEmployees
      offsetTop={headerHeight}
      onEmployeePress={(employee) =>
        router.push(`/employees/${employee.id}/profile`)
      }
    />
  );
};
