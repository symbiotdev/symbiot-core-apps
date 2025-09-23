import { Control, FieldValues, Path } from 'react-hook-form';
import { SwitchController } from '@symbiot-core-apps/form-controller';
import { Card, InitView } from '@symbiot-core-apps/ui';
import { useBrandEmployeePermissionsQuery } from '@symbiot-core-apps/api';

export function BrandEmployeePermissionsController<
  T extends FieldValues,
>(props: { control: Control<T>; onBlur?: () => void }) {
  const { data, isPending, error } = useBrandEmployeePermissionsQuery();

  if (!data?.length) {
    return <InitView loading={isPending} error={error} />;
  }

  return data.map((permission) => (
    <Card key={permission.key}>
      <SwitchController
        name={`permissions.${permission.key}` as Path<T>}
        label={permission.title}
        description={permission.subtitle}
        {...props}
      />
    </Card>
  ));
}
