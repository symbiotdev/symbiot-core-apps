import { Switch as UiSwitch, View, XStack } from 'tamagui';
import { useCallback } from 'react';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { Label, RegularText, Spinner } from '@symbiot-core-apps/ui';

const switchHeight = 26;
const switchWidth = 42;

export const Switch = ({
  label,
  description,
  checked,
  disabled,
  required,
  loading,
  onChange,
}: {
  label?: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  onChange?: (value: boolean) => void;
}) => {
  const onCheckedChange = useCallback((value: boolean) => {
    emitHaptic();
    onChange?.(value);
  }, [onChange]);

  return (
    <XStack alignItems="flex-start" justifyContent="space-between" gap="$5">
      {(!!label || !!description) && (
        <View flex={1}>
          {label && (
            <Label lineHeight={switchHeight} flex={1}>
              {label} {required ? '*' : ''}
            </Label>
          )}

          {!!description && (
            <RegularText fontSize={12} color="$placeholderColor" flex={1}>
              {description}
            </RegularText>
          )}
        </View>
      )}

      {loading ? (
        <View
          width={switchWidth}
          height={switchHeight}
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </View>
      ) : (
        <UiSwitch
          native="android"
          paddingHorizontal={2}
          cursor="pointer"
          width={switchWidth}
          height={switchHeight}
          checked={checked}
          borderWidth={0}
          disabled={disabled}
          backgroundColor={checked ? '$switchSelectedColor' : '$background'}
          opacity={disabled ? 0.8 : 1}
          onCheckedChange={onCheckedChange}
        >
          <UiSwitch.Thumb
            top={2}
            backgroundColor={checked ? '$o_color' : '$color'}
            animation="bouncy"
            width={21}
            height={21}
          />
        </UiSwitch>
      )}
    </XStack>
  );
};
