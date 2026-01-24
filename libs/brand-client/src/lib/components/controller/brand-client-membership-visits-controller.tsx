import { Control, FieldValues, Path } from 'react-hook-form';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useMemo } from 'react';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandClientMembershipVisitsController<
  T extends FieldValues,
>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  loading?: boolean;
  includeZero?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  const options = useMemo(() => {
    const visits = Array.from({ length: 100 }).map((_, i) => {
      const value = i + 1;

      return {
        label: String(value),
        value,
      };
    });

    return props.includeZero ? [{ label: '0', value: 0 }, ...visits] : visits;
  }, [props.includeZero]);

  return (
    <SelectController
      label={!props.noLabel ? t(`${tPrefix}.form.visits.label`) : ''}
      placeholder={t(`${tPrefix}.form.visits.placeholder`)}
      options={options}
      rules={{
        required: {
          value: true,
          message: t(`${tPrefix}.form.visits.error.required`),
        },
      }}
      {...props}
    />
  );
}
