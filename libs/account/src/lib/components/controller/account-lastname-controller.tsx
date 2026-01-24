import { Control, FieldValues, Path } from 'react-hook-form';
import { StringController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function AccountLastnameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <StringController
      maxLength={64}
      label={t('shared.account.form.lastname.label')}
      placeholder={t('shared.account.form.lastname.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('shared.account.form.lastname.error.required'),
        },
      }}
      {...props}
    />
  );
}
