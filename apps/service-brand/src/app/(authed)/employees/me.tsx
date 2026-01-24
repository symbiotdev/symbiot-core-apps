import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandEmployeeProfile } from '@symbiot-core-apps/brand-employee';
import React from 'react';
import { InitView } from '@symbiot-core-apps/ui';

export default () => {
  const { currentEmployee } = useCurrentBrandEmployee();

  if (!currentEmployee) {
    return <InitView loading />;
  }

  return <BrandEmployeeProfile employee={currentEmployee} />;
};
