import { Control, FieldValues, Path } from 'react-hook-form';
import { TextController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandEmployeeAboutController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  showLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <TextController
      label={props.showLabel ? t('brand_employee.form.about.label') : ''}
      placeholder={t('brand_employee.form.about.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_employee.form.about.error.required'),
        },
      }}
      {...props}
    />
  );
}
