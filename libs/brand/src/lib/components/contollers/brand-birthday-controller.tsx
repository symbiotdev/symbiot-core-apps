import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '@symbiot-core-apps/ui';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';

type FormValue = {
  birthday: Date | null;
};

export const BrandBirthdayController = ({
  birthday,
  onUpdate,
}: FormValue & {
  onUpdate: (value: { birthday: string | null }) => void;
}) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      birthday,
    },
  });

  const update = useCallback(
    (value: FormValue) => {
      value.birthday !== birthday &&
        onUpdate({
          birthday: value.birthday?.toISOString() || null,
        });
    },
    [birthday, onUpdate],
  );

  useEffect(() => {
    setValue('birthday', birthday);
  }, [birthday, setValue]);

  return (
    <Controller
      control={control}
      name="birthday"
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <DatePicker
          value={value}
          error={error?.message}
          formatStr={me?.preferences?.dateFormat}
          weekStartsOn={me?.preferences?.weekStartsOn}
          minDate={DateHelper.addYears(new Date(), -500)}
          maxDate={new Date()}
          label={t('brand.form.birthday.label')}
          placeholder={t(
            'brand.form.birthday.placeholder',
          )}
          onChange={(birthday) => {
            onChange(birthday);
            handleSubmit(update)();
          }}
        />
      )}
    />
  );
};
