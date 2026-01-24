import { Control, FieldValues, Path } from 'react-hook-form';
import { DateController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandBirthdayController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <DateController
      label={t('brand.form.birthday.label')}
      placeholder={t('brand.form.birthday.placeholder')}
      maxDate={new Date()}
      {...props}
    />
  );
}
