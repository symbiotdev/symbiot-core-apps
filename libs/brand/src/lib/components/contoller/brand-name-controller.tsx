import { Input } from '@symbiot-core-apps/ui';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const BrandNameController = ({
  control,
  noLabel,
  onBlur,
}: {
  control: Control<{ name: string }>;
  noLabel?: boolean;
  onBlur?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name="name"
      rules={{
        required: {
          value: true,
          message: t('brand.form.name.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          autoCapitalize="words"
          enterKeyHint="done"
          value={value}
          error={error?.message}
          label={!noLabel ? t('brand.form.name.label') : undefined}
          placeholder={t('brand.form.name.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
};
