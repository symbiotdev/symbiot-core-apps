import { TimezonePicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function BrandLocationTimezoneController<T extends FieldValues>({
  name,
  control,
  country,
  disabled,
  disableDrag,
  noLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  country?: string;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.timezone.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <TimezonePicker
          disableDrag={disableDrag}
          disabled={disabled}
          onlyCountryTimezones={!!country}
          country={country}
          value={value}
          error={error?.message}
          label={!noLabel ? t('brand_location.form.timezone.label') : ''}
          sheetLabel={t('brand_location.form.timezone.label')}
          placeholder={t('brand_location.form.timezone.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
