import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';

export function BrandLocationCurrenciesController<T extends FieldValues>({
  name,
  control,
  noLabel,
  disabled,
  disableDrag,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { brand } = useCurrentBrandState();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.currency.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
          disableDrag={disableDrag}
          disabled={disabled}
          value={value as string}
          error={error?.message}
          options={brand?.currencies}
          optionsLoading={!brand}
          label={!noLabel ? t('brand_location.form.currency.label') : undefined}
          sheetLabel={t('brand_location.form.currency.label')}
          placeholder={t('brand_location.form.currency.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
