import { Control, FieldValues, Path } from 'react-hook-form';
import { useCurrentBrandLocationsReq } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useMemo } from 'react';
import { useAllBrandLocation } from '@symbiot-core-apps/brand';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandServiceLocationController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { data, isPending, error } = useCurrentBrandLocationsReq();
  const allLocations = useAllBrandLocation();

  const options = useMemo(
    () =>
      data && [
        allLocations,
        ...data.items.map((location) => ({
          label: location.name,
          description: location.address,
          value: location.id,
        })),
      ],
    [allLocations, data],
  );

  return (
    <SelectController
      {...props}
      disabled={!data?.items?.length}
      label={!props.noLabel ? t('brand_service.form.location.label') : ''}
      placeholder={t('brand_service.form.location.placeholder')}
      options={options}
      optionsLoading={isPending}
      optionsError={error}
    />
  );
}
