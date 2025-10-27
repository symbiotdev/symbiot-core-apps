import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  gendersWithoutEmptyOption,
  useBrandEmployeeGendersReq,
} from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandEmployeeGenderController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  includeEmptyOption?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandEmployeeGendersReq();

  return (
    <SelectController
      label={t('brand_employee.form.gender.label')}
      placeholder={t('brand_employee.form.gender.placeholder')}
      options={
        !props.includeEmptyOption ? gendersWithoutEmptyOption(data) : data
      }
      optionsLoading={isPending}
      optionsError={error}
      rules={{
        required: {
          value: true,
          message: t('brand_employee.form.gender.error.required'),
        },
      }}
      {...props}
    />
  );
}
