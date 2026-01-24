import { Control, FieldValues, Path } from 'react-hook-form';
import { InstagramController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function AccountInstagramController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <InstagramController
      label={t('shared.account.form.instagram.label')}
      placeholder={t('shared.account.form.instagram.placeholder')}
      {...props}
    />
  );
}
