import { Control, FieldValues, Path } from 'react-hook-form';
import { useMemo } from 'react';
import { Avatar } from '@symbiot-core-apps/ui';
import { ToggleController } from '@symbiot-core-apps/form-controller';
import { useBrandEmployeeCurrentListReq } from '@symbiot-core-apps/api';

export function EmployeesBrandBookingController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
}) {
  const { items, isPending, error } = useBrandEmployeeCurrentListReq({
    params: {
      take: 999,
    },
  });

  const adjustedItems = useMemo(
    () =>
      items?.map((employee) => ({
        label: employee.name,
        description: employee.role,
        value: employee.id,
        icon: (
          <Avatar
            name={employee.name}
            size={40}
            url={employee.avatar?.xsUrl}
            color={employee.avatarColor}
          />
        ),
      })),
    [items],
  );

  return (
    <ToggleController
      {...props}
      required
      label={''}
      multiselect={false}
      items={adjustedItems}
      itemsLoading={isPending}
      itemsError={error}
    />
  );
}
