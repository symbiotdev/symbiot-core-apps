import { Control, FieldValues, Path } from 'react-hook-form';
import { SwitchController } from '@symbiot-core-apps/form-controller';
import { Card, InitView } from '@symbiot-core-apps/ui';
import {
  BrandEmployeePermissions,
  useBrandEmployeePermissionsQuery,
} from '@symbiot-core-apps/api';

export function BrandEmployeePermissionsController<
  T extends FieldValues,
>(props: {
  loadingKey?: keyof BrandEmployeePermissions;
  control: Control<T>;
  onChange?: (key: keyof BrandEmployeePermissions, value: boolean) => void;
}) {
  const { data, isPending, error } = useBrandEmployeePermissionsQuery();

  if (!data?.length) {
    return <InitView loading={isPending} error={error} />;
  }

  return data.map((permission) => (
    <Card key={permission.key}>
      <SwitchController
        disabled={!!props.loadingKey}
        loading={props.loadingKey === permission.key}
        name={`permissions.${permission.key}` as Path<T>}
        label={permission.title}
        control={props.control}
        description={permission.subtitle}
        onChange={(checked) => props.onChange?.(permission.key, checked)}
      />
    </Card>
  ));
}
