import { Control, FieldValues, Path } from 'react-hook-form';
import { useBrandLocationAdvantagesReq } from '@symbiot-core-apps/api';
import { ToggleController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationAdvantagesController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  control: Control<T>;
  showLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { data, isPending, error } = useBrandLocationAdvantagesReq();

  return (
    <ToggleController
      label={props.showLabel ? t('brand_location.form.advantages.label') : ''}
      items={data}
      itemsLoading={isPending}
      itemsError={error}
      errors={{
        required: t('brand_location.form.advantages.error.required'),
      }}
      {...props}
    />
  );
}
