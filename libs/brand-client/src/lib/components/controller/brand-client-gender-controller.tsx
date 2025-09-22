import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBrandClientGendersQuery } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandClientGenderController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandClientGendersQuery();

  return (
    <SelectController
      label={t('brand_client.form.gender.label')}
      placeholder={t('brand_client.form.gender.placeholder')}
      options={data}
      optionsLoading={isPending}
      optionsError={error}
      rules={{
        required: {
          value: true,
          message: t('brand_client.form.gender.error.required'),
        },
      }}
      {...props}
    />
  );
}
