import { Control, FieldValues, Path } from 'react-hook-form';
import { SwitchController } from '@symbiot-core-apps/form-controller';
import { Card } from '@symbiot-core-apps/ui';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandMembershipAvailabilityController<
  T extends FieldValues,
>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

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
