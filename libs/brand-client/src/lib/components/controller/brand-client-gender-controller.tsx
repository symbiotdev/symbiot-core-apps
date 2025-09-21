import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBrandClientGendersQuery } from '@symbiot-core-apps/api';

export function BrandClientGenderController<T extends FieldValues>({
  name,
  control,
  disabled,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error: serverError } = useBrandClientGendersQuery();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand_client.form.gender.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
          disabled={disabled}
          value={value as string}
          error={error?.message}
          options={data}
          optionsLoading={isPending}
          optionsError={serverError}
          label={t('brand_client.form.gender.label')}
          sheetLabel={t('brand_client.form.gender.label')}
          placeholder={t('brand_client.form.gender.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
