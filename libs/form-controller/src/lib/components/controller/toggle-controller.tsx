import {
  defaultPageHorizontalPadding,
  ToggleGroup,
  ToggleGroupItem,
} from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useEffect } from 'react';

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
  items?: ToggleGroupItem[];
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
        <ToggleGroup
          allowEmpty
          multiselect={multiselect}
          disabled={disabled}
          viewProps={{
            backgroundColor: '$background1',
            borderRadius: '$10',
            paddingHorizontal: defaultPageHorizontalPadding,
          }}
          label={label}
          items={items}
          loading={itemsLoading}
          noDataMessage={noDataMessage}
          error={itemsError}
          value={value}
          onChange={onChange}
        />
      )}
    />
  );
}
