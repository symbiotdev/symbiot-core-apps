import { Control, FieldValues, Path } from 'react-hook-form';
import { useCurrentBrandLocationsReq } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useMemo } from 'react';
import { useDynamicBrandLocation } from '@symbiot-core-apps/brand';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandEmployeeLocationController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const dynamicLocation = useDynamicBrandLocation();
  const { data, isPending, error } = useCurrentBrandLocationsReq();

  const options = useMemo(
    () =>
      data?.items && [
        dynamicLocation,
        ...data.items.map((location) => ({
          label: location.name,
          description: location.address,
          value: location.id,
        })),
      ],
    [dynamicLocation, data],
  );

  return (
    <SelectController
      {...props}
      disabled={!data?.items?.length}
      label={t('brand_employee.form.location.label')}
      placeholder={t('brand_employee.form.location.placeholder')}
      options={options}
      optionsLoading={isPending}
      optionsError={error}
    />
  );
}
