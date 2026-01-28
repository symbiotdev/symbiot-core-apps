import { View, XStack } from 'tamagui';
import { RegularText } from '@symbiot-core-apps/ui';
import { FormField } from './form-field';
import { useCallback } from 'react';
import { emitHaptic, isEqual } from '@symbiot-core-apps/shared';

export type OnChangeMultiToggle = (value?: unknown[]) => unknown;
export type MultiToggleItem = {
  label: string;
  value: unknown;
};

export const MultiToggle = ({
  items,
  value,
  label,
  error,
  disabled,
  required,
  max,
  onChange,
}: {
  items: MultiToggleItem[];
  value?: unknown[];
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  max?: number;
  onChange?: OnChangeMultiToggle;
}) => {
  const onToggle = useCallback(
    (itemValue: unknown) => {
      if (value && value.some((v) => isEqual(itemValue, v))) {
        onChange?.(value.filter((v) => !isEqual(itemValue, v)));
      } else {
        const nextValue = [...(value || []), itemValue];

        if (max && nextValue.length > max) return;

        onChange?.([...(value || []), itemValue]);
      }

      emitHaptic();
    },
    [max, onChange, value],
  );

  return (
    <FormField label={label} error={error} required={required}>
      <XStack
        flexWrap="wrap"
        gap="$2"
        marginTop={1}
        disabled={disabled}
        disabledStyle={{ opacity: 0.5 }}
      >
        {items.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            backgroundColor={
              value?.some((v) => isEqual(item.value, v))
                ? '$highlighted'
                : '$background1'
            }
            padding="$3"
            justifyContent="center"
            borderRadius="$10"
            cursor="pointer"
            onPress={() => onToggle(item.value)}
          >
            <RegularText textAlign="center">{item.label}</RegularText>
          </View>
        ))}
      </XStack>
    </FormField>
  );
};
