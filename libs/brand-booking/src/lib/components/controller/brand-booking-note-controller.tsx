import { Control, FieldValues, Path } from 'react-hook-form';
import { TextController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandBookingNoteController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  placeholder?: string;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <TextController
      {...props}
      label={''}
      placeholder={props.placeholder || t(`shared.type_here`)}
    />
  );
}
