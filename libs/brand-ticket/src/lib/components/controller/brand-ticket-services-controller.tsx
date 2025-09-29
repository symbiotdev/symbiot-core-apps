import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ToggleController } from '@symbiot-core-apps/form-controller';
import {
  BrandService,
  useServicesListByLocationQuery,
  useServicesQuery,
} from '@symbiot-core-apps/api';
import { useMemo } from 'react';

type ControllerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
};

export function BrandTicketServicesController<T extends FieldValues>(
  props: ControllerProps<T> & {
    location?: string | null;
  },
) {
  return props.location ? (
    <LocationServices {...props} location={props.location} />
  ) : (
    <BrandServices {...props} />
  );
}

function BrandServices<T extends FieldValues>(props: ControllerProps<T>) {
  const { items, isPending, error } = useServicesQuery({
    params: {
      take: 999,
    },
  });

  return (
    <ServicesController
      {...props}
      items={items}
      itemsLoading={isPending}
      itemsError={error}
    />
  );
}

function LocationServices<T extends FieldValues>(
  props: ControllerProps<T> & {
    location: string;
  },
) {
  const { items, isPending, error } = useServicesListByLocationQuery({
    location: props.location,
    params: {
      take: 999,
    },
  });

  return (
    <ServicesController
      {...props}
      items={items}
      itemsLoading={isPending}
      itemsError={error}
    />
  );
}

function ServicesController<T extends FieldValues>(
  props: ControllerProps<T> & {
    items?: BrandService[];
    itemsLoading?: boolean;
    itemsError?: string | null;
  },
) {
  const { t } = useTranslation();

  const items = useMemo(
    () =>
      props.items?.map((service) => ({
        label: service.name,
        description: service.description,
        value: service.id,
      })),
    [props.items],
  );

  return (
    <ToggleController
      {...props}
      label={!props.noLabel ? t('brand_ticket.form.services.label') : ''}
      items={items}
      errors={{
        required: t('brand_ticket.form.services.error.required'),
      }}
    />
  );
}
