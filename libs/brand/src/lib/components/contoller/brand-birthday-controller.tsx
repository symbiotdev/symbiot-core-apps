import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { DatePicker } from '@symbiot-core-apps/ui';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';

export function BrandBirthdayController<T extends FieldValues>({
  name,
  control,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <DatePicker
          value={value}
          error={error?.message}
          formatStr={me?.preferences?.dateFormat}
          weekStartsOn={me?.preferences?.weekStartsOn}
          minDate={DateHelper.addYears(new Date(), -500)}
          maxDate={new Date()}
          label={t('brand.form.birthday.label')}
          placeholder={t('brand.form.birthday.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
