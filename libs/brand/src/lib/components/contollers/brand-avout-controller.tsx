import { Textarea } from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';

type FormValue = {
  about: string;
};

export const BrandAboutController = ({
  about = '',
  onUpdate,
}: FormValue & {
  onUpdate: (props: FormValue) => void;
}) => {
  const { t } = useTranslation();

  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      about,
    },
  });

  const update = useCallback(
    (value: FormValue) => {
      value.about !== about && onUpdate(value);
    },
    [about, onUpdate],
  );

  useEffect(() => {
    setValue('about', about);
  }, [about, setValue]);

  return (
    <Controller
      control={control}
      name="about"
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Textarea
          countCharacters
          enterKeyHint="done"
          value={value}
          error={error?.message}
          label={t('brand.information.preferences.form.about.label')}
          placeholder={t(
            'brand.information.preferences.form.about.placeholder',
          )}
          onChange={onChange}
          onBlur={handleSubmit(update)}
        />
      )}
    />
  );
};
