import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StringController } from '@symbiot-core-apps/form-controller';

export function AccountFirstnameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <StringController
      maxLength={64}
      label={t('shared.account.form.firstname.label')}
      placeholder={t('shared.account.form.firstname.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('shared.account.form.firstname.error.required'),
        },
      }}
      {...props}
    />
  );
}
