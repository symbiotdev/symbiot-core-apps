import { DimensionValue, Platform } from 'react-native';
import { useCallback, useMemo, useRef } from 'react';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
} from '../popover/adaptive-popover';
import { FormField } from './form-field';
import { Spinner } from '../loading/spinner';
import { RegularText } from '../text/text';
import { InputFieldView } from '../view/input-field-view';
import { Picker, PickerItem, PickerOnChange } from './picker';

export function SelectPicker({
  value,
  label,
  sheetLabel,
  error,
  placeholder,
  disabled,
  required,
  disableDrag,
  lazy,
  moveSelectedToTop,
  noCheckedValue,
  optionsLoading,
  optionsError,
  options,
  onChange,
}: {
  value: unknown;
  label?: string;
  sheetLabel?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  disableDrag?: boolean;
  lazy?: boolean;
  moveSelectedToTop?: boolean;
  noCheckedValue?: string;
  maxWidth?: DimensionValue;
  optionsLoading?: boolean;
  optionsError?: string | null;
  options?: PickerItem[];
  onChange: PickerOnChange;
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

  const onChangeValue = useCallback(
    (value: unknown) => {
      onChange?.(value);

      if (Platform.OS !== 'ios') {
        popoverRef.current?.close();
      }
    },
    [onChange],
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
        triggerType="child"
        trigger={
          <InputFieldView disabled={disabled}>
            {!options?.length && optionsLoading ? (
              <>
                <Spinner width={16} height={16} />
                <RegularText
                  color="$placeholderColor"
                  numberOfLines={1}
                  flex={1}
                >
                  {placeholder}
                </RegularText>
              </>
            ) : !formattedValue ? (
              <RegularText color="$placeholderColor" numberOfLines={1} flex={1}>
                {placeholder}
              </RegularText>
            ) : (
              <RegularText
                flex={1}
                numberOfLines={1}
                color={disabled ? '$disabled' : '$color'}
              >
                {formattedValue}
              </RegularText>
            )}
          </InputFieldView>
        }
      >
        <Picker
          value={value}
          options={options}
          optionsLoading={optionsLoading}
          optionsError={optionsError}
          disabled={disabled}
          lazy={lazy}
          moveSelectedToTop={moveSelectedToTop}
          onChange={onChangeValue}
        />
      </AdaptivePopover>
    </FormField>
  );
}
