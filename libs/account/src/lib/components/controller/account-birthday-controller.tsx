import { DatePicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentAccount } from '@symbiot-core-apps/state';

export function AccountBirthdayController<T extends FieldValues>({
  name,
  control,
  disabled,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { me } = useCurrentAccount();
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <DatePicker
          disabled={disabled}
          value={value}
          error={error?.message}
          formatStr={me?.preferences?.dateFormat}
          weekStartsOn={me?.preferences?.weekStartsOn}
          minDate={DateHelper.addYears(new Date(), -100)}
          maxDate={new Date()}
          label={t('shared.account.form.birthday.label')}
          placeholder={t('shared.account.form.birthday.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
