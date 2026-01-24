import { Control, FieldValues, Path } from 'react-hook-form';
import { useAccountGendersReq } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function AccountGenderController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { data, isPending, error } = useAccountGendersReq();

  return (
    <SelectController
      label={t('shared.account.form.gender.label')}
      placeholder={t('shared.account.form.gender.placeholder')}
      options={data}
      optionsLoading={isPending}
      optionsError={error}
      {...props}
    />
  );
}
