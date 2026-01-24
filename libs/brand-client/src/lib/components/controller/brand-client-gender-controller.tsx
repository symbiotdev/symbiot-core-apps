import { Control, FieldValues, Path } from 'react-hook-form';
import { useBrandClientGendersReq } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandClientGenderController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { data, isPending, error } = useBrandClientGendersReq();

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
