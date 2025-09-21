import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InstagramInput } from '@symbiot-core-apps/ui';

export function AccountInstagramsController<T extends FieldValues>({
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
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <InstagramInput
          enterKeyHint="done"
          disabled={disabled}
          value={value}
          label={t('shared.account.form.instagram.label')}
          placeholder={t('shared.account.form.instagram.placeholder')}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
