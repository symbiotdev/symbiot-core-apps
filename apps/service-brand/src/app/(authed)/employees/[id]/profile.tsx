import { BrandEmployeeProfile } from '@symbiot-core-apps/brand-employee';
import { useBrandEmployeeProfileByIdReq } from '@symbiot-core-apps/api';
import { InitView } from '@symbiot-core-apps/ui';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: employee,
    isPending,
    error,
  } = useBrandEmployeeProfileByIdReq(id);

  if (!employee) {
    return <InitView loading={isPending} error={error} />;
  }

  return <BrandEmployeeProfile employee={employee} />;
};
