import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DateController } from '@symbiot-core-apps/form-controller';

export function BrandBirthdayController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <DateController
      label={t('brand.form.birthday.label')}
      placeholder={t('brand.form.birthday.placeholder')}
      {...props}
    />
  );
}
