import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PhoneController } from '@symbiot-core-apps/form-controller';

export function AccountPhoneController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <PhoneController
      label={t('shared.account.form.phone.label')}
      placeholder={t('shared.account.form.phone.placeholder')}
      errors={{
        required: t('shared.account.form.phone.error.required'),
        validation: t('shared.account.form.phone.error.validation'),
      }}
      {...props}
    />
  );
}
