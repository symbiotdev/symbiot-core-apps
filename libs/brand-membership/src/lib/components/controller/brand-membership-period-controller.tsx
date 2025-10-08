import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
  useBrandMembershipPeriodsQuery,
} from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandMembershipPeriodController<T extends FieldValues>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  withEmpty?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandMembershipPeriodsQuery();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  return (
    <SelectController
      {...props}
      label={t(`${tPrefix}.form.period.label`)}
      placeholder={t(`${tPrefix}.form.period.placeholder`)}
      options={data}
      optionsLoading={isPending}
      optionsError={error}
    />
  );
}
