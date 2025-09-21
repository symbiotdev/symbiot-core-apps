import { Input } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function AccountLastnameController<T extends FieldValues>({
  name,
  control,
  disabled,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('shared.account.form.lastname.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          autoCapitalize="words"
          enterKeyHint="done"
          disabled={disabled}
          value={value}
          error={error?.message}
          label={t('shared.account.form.lastname.label')}
          placeholder={t('shared.account.form.lastname.label')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
