import { Control, FieldValues, Path } from 'react-hook-form';
import { ToggleController } from '@symbiot-core-apps/form-controller';
import {
  BrandMembershipType,
  BrandService,
  getTranslateKeyByBrandMembershipType,
  useServicesListByLocationReq,
  useServicesReq,
} from '@symbiot-core-apps/api';
import { useMemo } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';

type ControllerProps<T extends FieldValues> = {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
};

export function BrandMembershipServicesController<T extends FieldValues>(
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
  const { items, isPending, error } = useServicesReq({
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
  const { items, isPending, error } = useServicesListByLocationReq({
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
  const { t } = useI18n();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

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
      items={items}
      label={!props.noLabel ? t(`${tPrefix}.form.services.label`) : ''}
      noDataMessage={t(`${tPrefix}.create.steps.services.empty`)}
      errors={{
        required: t(`${tPrefix}.form.services.error.required`),
      }}
    />
  );
}
