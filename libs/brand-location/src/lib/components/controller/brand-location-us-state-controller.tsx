import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import states from 'states-us';

export function BrandLocationUsStateController<T extends FieldValues>({
  name,
  control,
  disabled,
  disableDrag,
  noLabel,
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

  const options = states.map((state) => ({
    value: state.abbreviation,
    label: state.name,
  }));

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.us_state.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
          disableDrag={disableDrag}
          disabled={disabled}
          value={value as string}
          error={error?.message}
          options={options}
          label={!noLabel ? t('brand_location.form.us_state.label') : undefined}
          sheetLabel={t('brand_location.form.us_state.label')}
          placeholder={t('brand_location.form.us_state.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
