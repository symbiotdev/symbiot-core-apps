import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isValidURL } from '@symbiot-core-apps/shared';
import { WebsiteInput } from '@symbiot-core-apps/ui';

export const BrandWebsitesController = ({
  control,
  noLabel,
  onBlur,
}: {
  control: Control<{ website: string | null }>;
  noLabel?: boolean;
  onBlur?: () => void;
}) => {
  const { t } = useTranslation();

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
          label={!noLabel ? t('brand.form.website.label') : ''}
          placeholder={t('brand.form.website.placeholder')}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
};
