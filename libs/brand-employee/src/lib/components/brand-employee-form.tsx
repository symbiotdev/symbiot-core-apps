import { BrandEmployee } from '@symbiot-core-apps/api';
import { FormView, ListItemGroup, PageView } from '@symbiot-core-apps/ui';
import { BrandEmployeeMediaForm } from './brand-employee-media-form';
import { BrandEmployeePersonalInfo } from './brand-employee-personal-info';
import { BrandEmployeeIdentificationForm } from './brand-employee-identification-form';
import { BrandEmployeeContactInfo } from './brand-employee-contact-info';
import { BrandEmployeeLocationsForm } from './brand-employee-locations-form';
import { BrandEmployeePermissionsForm } from './brand-employee-permissions-form';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { BrandEmployeeAboutForm } from './brand-employee-about-form';
import { BrandEmployeePositionForm } from './brand-employee-position-form';

export const BrandEmployeeForm = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { brand } = useCurrentBrandState();

  return (
    <PageView scrollable withHeaderHeight withKeyboard>
      <FormView gap="$10" paddingVertical="$5">
        <BrandEmployeeMediaForm employee={employee} />

        <ListItemGroup>
          <BrandEmployeePersonalInfo employee={employee} />
          <BrandEmployeePositionForm employee={employee} />
          <BrandEmployeeAboutForm employee={employee} />
          <BrandEmployeeLocationsForm employee={employee} />
          <BrandEmployeeContactInfo employee={employee} />
          <BrandEmployeeIdentificationForm employee={employee} />

          {brand?.owner?.id !== employee.id && (
            <BrandEmployeePermissionsForm employee={employee} />
          )}
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
