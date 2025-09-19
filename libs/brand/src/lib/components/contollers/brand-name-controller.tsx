import { Input } from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';

type FormValue = {
  name: string;
};

export const BrandNameController = ({
  name = '',
  onUpdate,
}: FormValue & {
  onUpdate: (props: FormValue) => void;
}) => {
  const { t } = useTranslation();

  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      name,
    },
  });

  const update = useCallback(
    (value: FormValue) => {
      value.name !== name && onUpdate(value);
    },
    [name, onUpdate],
  );

  useEffect(() => {
    name && setValue('name', name);
  }, [name, setValue]);

  return (
    <Controller
      control={control}
      name="name"
      rules={{
        required: {
          value: true,
          message: t('brand.information.preferences.form.name.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          autoCapitalize="words"
          enterKeyHint="done"
          value={value}
          error={error?.message}
          label={t('brand.information.preferences.form.name.label')}
          placeholder={t('brand.information.preferences.form.name.placeholder')}
          onChange={onChange}
          onBlur={handleSubmit(update)}
        />
      )}
    />
  );
};
