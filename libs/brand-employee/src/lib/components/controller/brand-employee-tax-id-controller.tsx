import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StringController } from '@symbiot-core-apps/form-controller';

export function BrandEmployeeTaxIdController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <StringController
      label={t('brand_employee.form.tax_id.label')}
      placeholder={t('brand_employee.form.tax_id.placeholder')}
      {...props}
    />
  );
}
