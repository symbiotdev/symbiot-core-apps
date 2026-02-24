import { Control, FieldValues, Path } from 'react-hook-form';
import { useBrandServiceGendersReq } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandServiceGenderController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
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
