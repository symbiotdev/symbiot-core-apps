import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { arraysOfObjectsEqual, isValidURL } from '@symbiot-core-apps/shared';
import { WebsiteInput } from '@symbiot-core-apps/ui';

type FormValue = {
  websites: string[];
};

export const BrandWebsitesController = ({
  websites,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, setValue } = useForm<{
    website: string | null;
  }>({
    defaultValues: {
      website: websites[0],
    },
  });

  const update = useCallback(
    ({ website }: { website: string | null }) => {
      const nextValue = website ? [website] : [];

      if (!arraysOfObjectsEqual(websites, nextValue))
        onUpdate({ websites: nextValue });
    },
    [onUpdate, websites],
  );

  useEffect(() => {
    setValue('website', websites[0] || null);
  }, [setValue, websites]);

  return (
    <Controller
      name="website"
      control={control}
      rules={{
        validate: (value) =>
          !value || isValidURL(value)
            ? true
            : t('brand.form.website.error.validation'),
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <WebsiteInput
          enterKeyHint="done"
          value={value}
          label={t('brand.form.website.label')}
          placeholder={t(
            'brand.form.website.placeholder',
          )}
          error={error?.message}
          onChange={onChange}
          onBlur={handleSubmit(update)}
        />
      )}
    />
  );
};
