import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DateController } from '@symbiot-core-apps/form-controller';

export function BrandClientBirthdayController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <DateController
      label={t('brand_client.form.birthday.label')}
      placeholder={t('brand_client.form.birthday.placeholder')}
      {...props}
    />
  );
}
