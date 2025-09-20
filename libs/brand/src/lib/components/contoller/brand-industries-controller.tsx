import { useBrandIndustriesQuery } from '@symbiot-core-apps/api';
import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function BrandIndustriesController<T extends FieldValues>({
  name,
  control,
  noLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const {
    data,
    isPending: industriesLoading,
    error: industriesError,
  } = useBrandIndustriesQuery();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand.form.industry.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
          value={value as string}
          error={error?.message}
          options={data}
          optionsLoading={industriesLoading}
          optionsError={industriesError}
          label={!noLabel ? t('brand.form.industry.label') : ''}
          sheetLabel={t('brand.form.industry.label')}
          placeholder={t('brand.form.industry.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
