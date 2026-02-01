import { DimensionValue, Platform } from 'react-native';
import { ReactElement, useCallback, useMemo, useRef } from 'react';
import { Picker, PickerItem, PickerOnChange } from './picker';
import { View } from 'tamagui';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
  LightText,
  RegularText,
  Spinner,
} from '@symbiot-core-apps/ui';
import { FormField } from '../wrapper/form-field';
import { InputFieldView } from '../wrapper/input-field-view';

export function SelectPicker({
  value,
  label,
  sheetLabel,
  error,
  placeholder,
  disabled,
  loading,
  required,
  disableDrag,
  lazy,
  moveSelectedToTop,
  showSelectedDescription,
  optionsCentered,
  noCheckedValue,
  optionsLoading,
  optionsError,
  options,
  trigger,
  onChange,
  onBlur,
}: {
  value?: unknown;
  label?: string;
  sheetLabel?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  disableDrag?: boolean;
  lazy?: boolean;
  moveSelectedToTop?: boolean;
  showSelectedDescription?: boolean;
  optionsCentered?: boolean;
  noCheckedValue?: string;
  maxWidth?: DimensionValue;
  options?: PickerItem[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  trigger?: ReactElement;
  onChange: PickerOnChange;
  onBlur?: () => void;
}) {
  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const formattedValue = useMemo(
    () =>
      (value !== undefined &&
        (Array.isArray(value)
          ? value
              .map(
                (valueItem) =>
                  options?.find((option) => option.value === valueItem)?.label,
              )
              .filter(Boolean)
              .join(', ')
          : options?.find((option) => option.value === value)?.label)) ||
      noCheckedValue,
    [noCheckedValue, options, value],
  );

  const description = useMemo(
    () =>
      showSelectedDescription &&
      value !== undefined &&
      (Array.isArray(value)
        ? value.find((valueItem) =>
            options?.some((option) => option.value === valueItem),
          )?.description
        : options?.find((option) => option.value === value)?.description),
    [options, showSelectedDescription, value],
  );

  const onChangeValue = useCallback(
    (value: unknown) => {
      onChange?.(value);

      if (Platform.OS !== 'ios') {
        popoverRef.current?.close();
        onBlur?.();
      }
    },
    [onBlur, onChange],
  );

  return (
    <FormField label={label} error={error} required={required}>
      <AdaptivePopover
        ignoreScroll
        ref={popoverRef}
        disabled={disabled}
        disableDrag={disableDrag}
        sheetTitle={sheetLabel}
        minWidth={200}
        trigger={
          <View gap="$2" cursor="pointer" pressStyle={{ opacity: 0.8 }}>
            {trigger || (
              <InputFieldView disabled={disabled} gap="$3">
                {!options?.length && optionsLoading ? (
                  <LightText
                    color="$placeholderColor"
                    numberOfLines={1}
                    flex={1}
                  >
                    {placeholder}
                  </LightText>
                ) : !formattedValue ? (
                  <LightText
                    color="$placeholderColor"
                    numberOfLines={1}
                    flex={1}
                  >
                    {placeholder}
                  </LightText>
                ) : (
                  <LightText
                    flex={1}
                    numberOfLines={1}
                    color={disabled ? '$disabled' : '$color'}
                  >
                    {formattedValue}
                  </LightText>
                )}

                {(loading || (!options?.length && optionsLoading)) && (
                  <Spinner marginLeft="auto" width={16} height={16} />
                )}
              </InputFieldView>
            )}

            {!!description && (
              <RegularText color="$placeholderColor" paddingHorizontal="$4">
                {description}
              </RegularText>
            )}
          </View>
        }
        onClose={onBlur}
      >
        <Picker
          value={value}
          options={options}
          optionsLoading={optionsLoading}
          optionsError={optionsError}
          disabled={disabled}
          lazy={lazy}
          optionsCentered={optionsCentered}
          moveSelectedToTop={moveSelectedToTop}
          onChange={onChangeValue}
        />
      </AdaptivePopover>
    </FormField>
  );
}
