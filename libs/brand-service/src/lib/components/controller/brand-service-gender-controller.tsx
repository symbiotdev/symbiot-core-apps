import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBrandServiceGendersReq } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandServiceGenderController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  withEmpty?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandServiceGendersReq();

  return (
    <SelectController
      {...props}
      label={t('brand_service.form.gender.label')}
      placeholder={t('brand_service.form.gender.placeholder')}
      options={data}
      optionsLoading={isPending}
      optionsError={error}
    />
  );
}
