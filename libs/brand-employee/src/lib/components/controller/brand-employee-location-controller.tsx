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
  const { items, isPending, error } = useCurrentBrandLocationsReq();

  const options = useMemo(
    () =>
      items && [
        dynamicLocation,
        ...items.map((location) => ({
          label: location.name,
          description: location.address,
          value: location.id,
        })),
      ],
    [dynamicLocation, items],
  );

  return (
    <SelectController
      {...props}
      searchable
      moveSelectedToTop
      disabled={!items?.length}
      label={t('brand_employee.form.location.label')}
      placeholder={t('brand_employee.form.location.placeholder')}
      options={options}
      optionsLoading={isPending}
      optionsError={error}
    />
  );
}
