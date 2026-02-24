import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  BrandServiceType,
  useBrandServiceTypesReq,
} from '@symbiot-core-apps/api';
import { useEffect } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';
import { PickerOnChange, Select } from '@symbiot-core-apps/form-controller';

export function BrandServiceTypeController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { data, isPending, error } = useBrandServiceTypesReq();

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{
        required: false,
      }}
      render={({ field: { value, onChange } }) => (
        <SelectType
          value={value}
          disabled={props.disabled}
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

const SelectType = ({
  value,
  options,
  optionsLoading,
  optionsError,
  disabled,
  onChange,
  onBlur,
}: {
  value?: string;
  options?: BrandServiceType[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  disabled?: boolean;
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
    <Select
      required
      searchable
      moveSelectedToTop
      label={t('brand_service.form.type.label')}
      placeholder={t('brand_service.form.type.placeholder')}
      value={value}
      disabled={disabled}
      options={options}
      optionsLoading={optionsLoading}
      optionsError={optionsError}
      fallbackOptions={options?.filter(({ value }) => !value)}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
