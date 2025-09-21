import { Input } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EmailPattern } from '@symbiot-core-apps/shared';

export function BrandClientEmailController<T extends FieldValues>({
  name,
  control,
  noLabel,
  disabled,
  required,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) =>
          !required && !value
            ? true
            : String(value).match(EmailPattern)
              ? true
              : t('brand_client.form.email.error.validation'),
        required: {
          value: Boolean(required),
          message: t('brand_client.form.email.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          enterKeyHint="done"
          type="email"
          keyboardType="email-address"
          disabled={disabled}
          value={value}
          error={error?.message}
          label={!noLabel ? t('brand_client.form.email.label') : undefined}
          placeholder={t('brand_client.form.email.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
