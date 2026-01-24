import { Control, FieldValues, Path } from 'react-hook-form';
import { SwitchController } from '@symbiot-core-apps/form-controller';
import { Card } from '@symbiot-core-apps/ui';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandEmployeeProviderController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <Card>
      <SwitchController
        label={t('brand_employee.form.provider.label')}
        description={t('brand_employee.form.provider.description')}
        onChange={props.onBlur}
        {...props}
      />
    </Card>
  );
}
