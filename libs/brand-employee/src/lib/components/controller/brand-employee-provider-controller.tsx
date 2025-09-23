import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwitchController } from '@symbiot-core-apps/form-controller';
import { Card } from '@symbiot-core-apps/ui';

export function BrandEmployeeProviderController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Card>
      <SwitchController
        label={t('brand_employee.form.provider.label')}
        description={t('brand_employee.form.provider.description')}
        {...props}
      />
    </Card>
  );
}
