import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InstagramInput } from '@symbiot-core-apps/ui';

export const BrandInstagramsController = ({
  control,
  noLabel,
  onBlur,
}: {
  control: Control<{ instagram: string | null }>;
  noLabel?: boolean;
  onBlur?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Controller
      name="instagram"
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <InstagramInput
          enterKeyHint="done"
          value={value}
          label={!noLabel ? t('brand.form.instagram.label') : ''}
          placeholder={t('brand.form.instagram.placeholder')}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
};
