import { BrandEmployeeProfile } from '@symbiot-core-apps/brand-employee';
import { useBrandEmployeeProfileByIdReq } from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { FallbackView, HeaderButton } from '@symbiot-core-apps/ui2';

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
        <>
          {/*todo - analytics*/}
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
        </>
      ),
    });
  }, [hasPermission, navigation, id]);

  if (!employee) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <BrandEmployeeProfile employee={employee} />;
};
