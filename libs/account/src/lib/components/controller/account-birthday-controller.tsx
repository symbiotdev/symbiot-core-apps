import { Control, FieldValues, Path } from 'react-hook-form';
import { DateController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function AccountBirthdayController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <DateController
      label={t('shared.account.form.birthday.label')}
      placeholder={t('shared.account.form.birthday.placeholder')}
      maxDate={new Date()}
      {...props}
    />
  );
}
