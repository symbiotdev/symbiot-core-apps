import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBrandMembershipValiditiesQuery } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandMembershipValidityController<
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
  const { data, isPending, error } = useBrandMembershipValiditiesQuery();

  return (
    <SelectController
      {...props}
      label={t('brand_membership.form.validity.label')}
      placeholder={t('brand_membership.form.validity.placeholder')}
      options={data}
      optionsLoading={isPending}
      optionsError={error}
    />
  );
}
