import { Control, FieldValues, Path } from 'react-hook-form';
import { PhoneController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function AccountPhoneController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

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
