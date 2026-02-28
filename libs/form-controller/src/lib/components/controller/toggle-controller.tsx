import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useEffect } from 'react';
import {
  PAGE_STYLE,
  ToggleList,
  ToggleListOption,
} from '@symbiot-core-apps/ui2';
import { FormField } from '../wrapper/form-field';
import { View } from 'tamagui';

export function ToggleController<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
  required,
  errors,
  multiselect = true,
  items,
  itemsLoading,
  itemsError,
  noDataMessage,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  multiselect?: boolean;
  items?: ToggleListOption[];
  itemsLoading?: boolean;
  itemsError?: string | null;
  noDataMessage?: string;
  errors?: {
    required: string;
  };
  disabled?: boolean;
  onBlur?: () => void;
}) {
  useEffect(() => {
    return () => {
      onBlur?.();
    };
  }, [onBlur]);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) =>
          !required
            ? true
            : Array.isArray(value) && value.length
              ? true
              : errors?.required || !!value,
      }}
      render={({ field: { value, onChange } }) => (
        <FormField label={label} required={required}>
          <View
            backgroundColor="$background1"
            borderRadius="$10"
            paddingHorizontal={PAGE_STYLE.paddingHorizontal}
            paddingVertical={PAGE_STYLE.paddingVertical / 2}
          >
            <ToggleList
              allowEmpty
              scrollEnabled={false}
              multiselect={multiselect}
              initialNumToRender={items?.length}
              disabled={disabled}
              options={items}
              optionsLoading={itemsLoading}
              optionsError={itemsError}
              noOptionsMessage={noDataMessage}
              value={value}
              onChange={onChange}
            />
          </View>
        </FormField>
      )}
    />
  );
}
