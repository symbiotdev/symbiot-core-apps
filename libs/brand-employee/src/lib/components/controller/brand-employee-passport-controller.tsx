import { Control, FieldValues, Path } from 'react-hook-form';
import { StringController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandEmployeePassportController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <StringController
      label={t('brand_employee.form.passport.label')}
      placeholder={t('brand_employee.form.passport.placeholder')}
      {...props}
    />
  );
}
