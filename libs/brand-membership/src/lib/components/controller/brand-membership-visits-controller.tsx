import { Control, FieldValues, Path } from 'react-hook-form';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useMemo } from 'react';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandMembershipVisitsController<T extends FieldValues>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  const options = useMemo(
    () =>
      Array.from({ length: 100 }).map((_, i) => {
        const value = i + 1;

        return {
          label: String(value),
          value,
        };
      }),
    [],
  );

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
