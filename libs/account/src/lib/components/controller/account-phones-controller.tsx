import { PhoneInput, validatePhone } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function AccountPhonesController<T extends FieldValues>({
  name,
  control,
  disabled,
  required,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
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
          validatePhone(
            value,
            t('shared.account.form.phone.error.validation'),
            required,
          ),
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <PhoneInput
          disabled={disabled}
          value={value}
          error={error?.message}
          label={t('shared.account.form.phone.label')}
          placeholder={t('shared.account.form.phone.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
