import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextController } from '@symbiot-core-apps/form-controller';

export function BrandBookingNoteController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  placeholder?: string;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <TextController
      {...props}
      label={''}
      placeholder={props.placeholder || t(`shared.type_here`)}
    />
  );
}
