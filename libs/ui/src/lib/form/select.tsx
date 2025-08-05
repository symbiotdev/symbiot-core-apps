import { Popover, XStack } from 'tamagui';
import { DimensionValue } from 'react-native';
import { useCallback, useMemo, useRef } from 'react';
import { AdaptivePopover } from '../popover/adaptive-popover';
import { FormField } from './form-field';
import { Spinner } from '../loading/spinner';
import { RegularText } from '../text/text';
import { InitView } from '../view/init-view';
import { InputFieldView } from '../view/input-field-view';
import { Icon } from '../icons';
import { emitHaptic } from '@symbiot-core-apps/shared';

export type SelectOption = {
  label: string;
  value: string | number | undefined;
};

export type SelectValue = SelectOption['value'] | SelectOption['value'][];
export type onChangeSelect = (value: SelectValue) => void;

export function Select({
  value,
  label,
  error,
  placeholder,
  disabled,
  noCheckedValue,
  optionsLoading,
  optionsError,
  options,
  onChange,
}: {
  value: SelectValue;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  noCheckedValue?: string;
  maxWidth?: DimensionValue;
  optionsLoading?: boolean;
  optionsError?: string | null;
  options?: SelectOption[];
  onChange: onChangeSelect;
}) {
  const ref = useRef<Popover>(null);

  const formattedValue = useMemo(
    () =>
      (value !== undefined &&
        value !== null &&
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

  const toggleOption = useCallback(
    (optionValue: SelectOption['value']) => {
      let newValue: SelectValue;
      let hasChanges: boolean;

      if (Array.isArray(value)) {
        const targetOption = value.some(
          (valueItem: SelectOption['value']) => valueItem === optionValue,
        );

        newValue = targetOption
          ? value.filter(
              (valueItem: SelectOption['value']) => valueItem !== optionValue,
            )
          : [...value, optionValue];

        hasChanges = true;
      } else {
        newValue = optionValue;

        hasChanges = newValue !== value;

        ref.current?.close();
      }

      if (hasChanges) {
        onChange(newValue);
        emitHaptic();
      }
    },
    [onChange, value],
  );

  return (
    <FormField label={label} error={error}>
      <AdaptivePopover
        ref={ref}
        disabled={disabled}
        sheetTitle={label}
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
        {!options?.length && (
          <InitView loading={optionsLoading} error={optionsError} />
        )}

        {options?.map((option, i) => (
          <XStack
            key={i}
            gap="$5"
            paddingVertical="$3"
            alignItems="center"
            justifyContent="space-between"
            cursor="pointer"
            onPress={() => toggleOption(option.value)}
          >
            <RegularText>{option.label}</RegularText>

            {(Array.isArray(value)
              ? value.some((valueItem) => valueItem === option.value)
              : value === option.value) && (
              <Icon
                name="Unread"
                color={disabled ? '$disabled' : '$checkboxColor'}
              />
            )}
          </XStack>
        ))}
      </AdaptivePopover>
    </FormField>
  );
}
