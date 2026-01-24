import { Control, FieldValues, Path } from 'react-hook-form';
import { useMemo } from 'react';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationCountryController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { brand } = useCurrentBrandState();

  const options = useMemo(
    () =>
      brand?.countries?.map((item) => ({
        label: `${item.flag} ${item.label}`,
        value: item.value,
      })),
    [brand?.countries],
  );

  return (
    <SelectController
      {...props}
      label={!props.noLabel ? t('brand_location.form.country.label') : ''}
      placeholder={t('brand_location.form.country.placeholder')}
      options={options}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.countries.error.required'),
        },
      }}
    />
  );
}
