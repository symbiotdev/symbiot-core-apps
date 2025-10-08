import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwitchController } from '@symbiot-core-apps/form-controller';
import { Card } from '@symbiot-core-apps/ui';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';

export function BrandMembershipAvailabilityController<
  T extends FieldValues,
>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Card>
      <SwitchController
        {...props}
        label={t(
          `${getTranslateKeyByBrandMembershipType(props.type)}.form.available.label`,
        )}
        description={''}
        onChange={props.onBlur}
      />
    </Card>
  );
}
