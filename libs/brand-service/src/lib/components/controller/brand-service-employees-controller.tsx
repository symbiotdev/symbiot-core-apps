import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ToggleController } from '@symbiot-core-apps/form-controller';
import {
  BrandEmployee,
  useCurrentBrandEmployeeProvidersByLocationListQuery,
  useCurrentBrandEmployeeProvidersListQuery,
} from '@symbiot-core-apps/api';
import { useMemo } from 'react';
import { Avatar } from '@symbiot-core-apps/ui';

type ControllerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
};

export function BrandServiceEmployeesController<T extends FieldValues>(
  props: ControllerProps<T> & {
    location?: string | null;
  },
) {
  return props.location ? (
    <LocationEmployees {...props} location={props.location} />
  ) : (
    <BrandEmployees {...props} />
  );
}

function BrandEmployees<T extends FieldValues>(props: ControllerProps<T>) {
  const { items, isPending, error } = useCurrentBrandEmployeeProvidersListQuery(
    {
      params: {
        take: 999,
      },
    },
  );

  return (
    <EmployeesController
      {...props}
      items={items}
      itemsLoading={isPending}
      itemsError={error}
    />
  );
}

function LocationEmployees<T extends FieldValues>(
  props: ControllerProps<T> & {
    location: string;
  },
) {
  const { items, isPending, error } =
    useCurrentBrandEmployeeProvidersByLocationListQuery({
      location: props.location,
      params: {
        take: 999,
      },
    });

  return (
    <EmployeesController
      {...props}
      items={items}
      itemsLoading={isPending}
      itemsError={error}
    />
  );
}

function EmployeesController<T extends FieldValues>(
  props: ControllerProps<T> & {
    items?: BrandEmployee[];
    itemsLoading?: boolean;
    itemsError?: string | null;
  },
) {
  const { t } = useTranslation();

  const items = useMemo(
    () =>
      props.items?.map((employee) => ({
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
    [props.items],
  );

  return (
    <ToggleController
      {...props}
      label={!props.noLabel ? t('brand_service.form.providers.label') : ''}
      items={items}
      errors={{
        required: t('brand_service.form.providers.error.required'),
      }}
    />
  );
}
