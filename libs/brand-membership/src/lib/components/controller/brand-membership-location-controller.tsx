import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
  useCurrentBrandLocationsReq,
} from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useMemo } from 'react';
import { useAllBrandLocation } from '@symbiot-core-apps/brand';

export function BrandMembershipLocationController<
  T extends FieldValues,
>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useCurrentBrandLocationsReq();
  const allLocations = useAllBrandLocation();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  const options = useMemo(
    () =>
      data && [
        allLocations,
        ...data.items.map((location) => ({
          label: location.name,
          description: location.address,
          value: location.id,
        })),
      ],
    [allLocations, data],
  );

  return (
    <SelectController
      {...props}
      disabled={!data?.items?.length}
      label={!props.noLabel ? t(`${tPrefix}.form.location.label`) : ''}
      placeholder={t(`${tPrefix}.form.location.placeholder`)}
      options={options}
      optionsLoading={isPending}
      optionsError={error}
    />
  );
}
