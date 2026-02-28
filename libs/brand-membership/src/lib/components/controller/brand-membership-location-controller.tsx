import { Control, FieldValues, Path } from 'react-hook-form';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
  useCurrentBrandLocationsReq,
} from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useMemo } from 'react';
import { useAllBrandLocation } from '@symbiot-core-apps/brand';
import { useI18n } from '@symbiot-core-apps/shared';

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
  const { t } = useI18n();
  const { items, isPending, error } = useCurrentBrandLocationsReq();
  const allLocations = useAllBrandLocation();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  const options = useMemo(
    () =>
      items && [
        allLocations,
        ...items.map((location) => ({
          label: location.name,
          description: location.address,
          value: location.id,
        })),
      ],
    [allLocations, items],
  );

  return (
    <SelectController
      {...props}
      searchable
      moveSelectedToTop
      disabled={!items?.length}
      label={!props.noLabel ? t(`${tPrefix}.form.location.label`) : ''}
      placeholder={t(`${tPrefix}.form.location.placeholder`)}
      options={options}
      optionsLoading={isPending}
      optionsError={error}
    />
  );
}
