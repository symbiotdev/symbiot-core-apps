import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { arraysOfObjectsEqual, isValidURL } from '@symbiot-core-apps/shared';
import { WebsiteInput } from '@symbiot-core-apps/ui';

type FormValue = {
  websites: string[];
};

export const BrandWebsiteController = ({
  websites,
  onUpdate,
}: FormValue & {
  onUpdate: (props: { websites: string[] }) => void;
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
    console.log('websites', websites);
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
            : t('brand.information.preferences.form.website.error.validation'),
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <WebsiteInput
          enterKeyHint="done"
          value={value}
          label={t('brand.information.preferences.form.website.label')}
          placeholder={t(
            'brand.information.preferences.form.website.placeholder',
          )}
          error={error?.message}
          onChange={onChange}
          onBlur={handleSubmit(update)}
        />
      )}
    />
  );
};
