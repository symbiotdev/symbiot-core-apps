import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef } from 'react';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { InstagramInput } from '@symbiot-core-apps/ui';

type FormValue = {
  instagrams: string[];
};

export const BrandInstagramController = ({
  instagrams,
  onUpdate,
}: FormValue & {
  onUpdate: (props: { instagrams: string[] }) => void;
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, setValue } = useForm<{ instagram: string }>({
    defaultValues: {
      instagram: instagrams[0],
    },
  });

  const initialValueRef = useRef(instagrams);

  const update = useCallback(
    ({ instagram }: { instagram: string }) => {
      const nextValue = instagram ? [instagram] : [];

      if (!arraysOfObjectsEqual(instagrams, nextValue))
        onUpdate({ instagrams: nextValue });
    },
    [instagrams, onUpdate],
  );

  useEffect(() => {
    if (!arraysOfObjectsEqual(instagrams, initialValueRef.current)) {
      setValue('instagram', instagrams[0]);
      initialValueRef.current = instagrams;
    }
  }, [setValue, instagrams]);

  return (
    <Controller
      name="instagram"
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <InstagramInput
          enterKeyHint="done"
          value={value}
          label={t('brand.information.preferences.form.instagram.label')}
          placeholder={t(
            'brand.information.preferences.form.instagram.placeholder',
          )}
          error={error?.message}
          onChange={onChange}
          onBlur={handleSubmit(update)}
        />
      )}
    />
  );
};
