import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';

export function BrandLocationCountryController<T extends FieldValues>({
  name,
  control,
  disabled,
  noLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
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
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.countries.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
          disabled={disabled}
          value={value as string}
          error={error?.message}
          options={options}
          label={
            !noLabel ? t('brand_location.form.country.label') : undefined
          }
          sheetLabel={t('brand_location.form.country.label')}
          placeholder={t('brand_location.form.country.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
