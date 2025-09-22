import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BirthdayController } from '@symbiot-core-apps/form-controller';

export function AccountBirthdayController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <BirthdayController
      label={t('shared.account.form.birthday.label')}
      placeholder={t('shared.account.form.birthday.placeholder')}
      {...props}
    />
  );
}
