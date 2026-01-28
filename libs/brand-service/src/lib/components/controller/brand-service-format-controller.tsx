import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  BrandServiceFormat,
  useBrandServiceFormatsReq,
} from '@symbiot-core-apps/api';
import { useEffect } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';
import {
  PickerOnChange,
  SelectPicker,
} from '@symbiot-core-apps/form-controller';

export function BrandServiceFormatController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  disableDrag?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { data, isPending, error } = useBrandServiceFormatsReq();

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{
        required: {
          value: true,
          message: t('brand_service.form.format.error.required'),
        },
      }}
      render={({ field: { value, onChange } }) => (
        <SelectFormat
          value={value}
          disabled={props.disabled}
          disableDrag={props.disableDrag}
          options={data}
          optionsLoading={isPending}
          optionsError={error}
          onChange={onChange}
          onBlur={props.onBlur}
        />
      )}
    />
  );
}

const SelectFormat = ({
  value,
  options,
  optionsLoading,
  optionsError,
  disabled,
  disableDrag,
  onChange,
  onBlur,
}: {
  value?: string;
  options?: BrandServiceFormat[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  disabled?: boolean;
  disableDrag?: boolean;
  onChange: PickerOnChange;
  onBlur?: () => void;
}) => {
  const { t } = useI18n();

  useEffect(() => {
    if (
      options?.length &&
      (!value || !options.some((item) => item.value === value))
    ) {
      onChange(options[0].value);
    }
  }, [options, value, onChange]);

  return (
    <SelectPicker
      required
      label={t('brand_service.form.format.label')}
      placeholder={t('brand_service.form.format.placeholder')}
      value={value}
      disabled={disabled}
      disableDrag={disableDrag}
      options={options}
      optionsLoading={optionsLoading}
      optionsError={optionsError}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
