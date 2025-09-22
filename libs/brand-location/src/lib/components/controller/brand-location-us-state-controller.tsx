import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import states from 'states-us';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandLocationUsStateController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  const options = states.map((state) => ({
    value: state.abbreviation,
    label: state.name,
  }));

  return (
    <SelectController
      options={options}
      label={!props.noLabel ? t('brand_location.form.us_state.label') : ''}
      placeholder={t('brand_location.form.us_state.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.us_state.error.required'),
        },
      }}
      {...props}
    />
  );
}
