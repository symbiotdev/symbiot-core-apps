import { BrandEmployeeProfile } from '@symbiot-core-apps/brand-employee';
import { useBrandEmployeeProfileByIdReq } from '@symbiot-core-apps/api';
import { HeaderButton, InitView } from '@symbiot-core-apps/ui';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { XStack } from 'tamagui';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const {
    data: employee,
    isPending,
    error,
  } = useBrandEmployeeProfileByIdReq(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack gap="$3" flex={1}>
          {/*todo*/}
          {/*{hasPermission('analytics') && (*/}
          {/*  <HeaderButton*/}
          {/*    iconName="ChartSquare"*/}
          {/*    onPress={() => router.push(`/employees/${id}/analytics`)}*/}
          {/*  />*/}
          {/*)}*/}
          {hasPermission('employees') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/employees/${id}/update`)}
            />
          )}
        </XStack>
      ),
    });
  }, [hasPermission, id, navigation]);

  if (!employee) {
    return <InitView loading={isPending} error={error} />;
  }

  return <BrandEmployeeProfile employee={employee} />;
};
