import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAccountGendersQuery } from '@symbiot-core-apps/api';
import { GenderController } from '@symbiot-core-apps/form-controller';

export function AccountGenderController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useAccountGendersQuery();

  return (
    <GenderController
      label={t('shared.account.form.gender.label')}
      placeholder={t('shared.account.form.gender.placeholder')}
      genders={data}
      gendersLoading={isPending}
      gendersError={error}
      {...props}
    />
  );
}
