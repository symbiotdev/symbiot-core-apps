import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InstagramController } from '@symbiot-core-apps/form-controller';

export function AccountInstagramController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <InstagramController
      label={t('shared.account.form.instagram.label')}
      placeholder={t('shared.account.form.instagram.placeholder')}
      {...props}
    />
  );
}
