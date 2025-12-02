import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StringController } from '@symbiot-core-apps/form-controller';

export function BrandEmployeeRoleController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <StringController
      label={props.noLabel ? '' : t('brand_employee.form.role.label')}
      placeholder={t('brand_employee.form.role.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_employee.form.role.error.required'),
        },
      }}
      {...props}
    />
  );
}
