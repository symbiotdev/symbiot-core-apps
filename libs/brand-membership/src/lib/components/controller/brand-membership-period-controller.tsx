import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBrandMembershipPeriodsQuery } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandMembershipPeriodController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  withEmpty?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandMembershipPeriodsQuery();

  return (
    <SelectController
      {...props}
      label={t('brand_membership.form.period.label')}
      placeholder={t('brand_membership.form.period.placeholder')}
      options={data}
      optionsLoading={isPending}
      optionsError={error}
    />
  );
}
