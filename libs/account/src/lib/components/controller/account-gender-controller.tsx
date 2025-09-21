import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAccountGendersQuery } from '@symbiot-core-apps/api';

export function AccountGenderController<T extends FieldValues>({
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
  const { data, isPending, error: serverError } = useAccountGendersQuery();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
          disabled={disabled}
          value={value as string}
          error={error?.message}
          options={data}
          optionsLoading={isPending}
          optionsError={serverError}
          label={t('shared.account.form.gender.label')}
          sheetLabel={t('shared.account.form.gender.label')}
          placeholder={t('shared.account.form.gender.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
