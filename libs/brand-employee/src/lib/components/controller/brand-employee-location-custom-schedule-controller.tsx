import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwitchController } from '@symbiot-core-apps/form-controller';
import { Card } from '@symbiot-core-apps/ui';

export function BrandEmployeeLocationCustomScheduleController<
  T extends FieldValues,
>(props: { name: Path<T>; control: Control<T>; onBlur?: () => void }) {
  const { t } = useTranslation();

  return (
    <Card>
      <SwitchController
        label={t('brand_employee.form.location_custom_schedule.label')}
        description={t(
          'brand_employee.form.location_custom_schedule.description',
        )}
        {...props}
      />
    </Card>
  );
}
