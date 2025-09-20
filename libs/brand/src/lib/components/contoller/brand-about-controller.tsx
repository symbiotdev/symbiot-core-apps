import { Textarea } from '@symbiot-core-apps/ui';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const BrandAboutController = ({
  control,
  noLabel,
  onBlur,
}: {
  control: Control<{ about: string }>;
  noLabel?: boolean;
  onBlur?: () => void;
}) => {
  const { t } = useTranslation();

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
          label={!noLabel ? t('brand.form.about.label') : undefined}
          placeholder={t('brand.form.about.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
};
