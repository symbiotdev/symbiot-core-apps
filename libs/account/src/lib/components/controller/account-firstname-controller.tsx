import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NameController } from '@symbiot-core-apps/form-controller';

export function AccountFirstnameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <NameController
      label={t('shared.account.form.firstname.label')}
      placeholder={t('shared.account.form.firstname.label')}
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
