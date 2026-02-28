import { Switch as UiSwitch, useTheme, View, XStack } from 'tamagui';
import { useCallback } from 'react';
import { emitHaptic, isWeb } from '@symbiot-core-apps/shared';
import { Label, RegularText, Spinner } from '@symbiot-core-apps/ui';
import { Switch as RNSwitch } from 'react-native';

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
  const theme = useTheme();
  const onCheckedChange = useCallback(
    (value: boolean) => {
      emitHaptic();
      onChange?.(value);
    },
    [onChange],
  );

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
            <RegularText fontSize={12} color="$placeholder" flex={1}>
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
        <>
          {!isWeb && (
            <RNSwitch
              thumbColor={theme.o_color?.val}
              value={checked}
              onValueChange={onCheckedChange}
            />
          )}

          {isWeb && (
            <UiSwitch
              paddingHorizontal={2}
              cursor="pointer"
              width={switchWidth}
              height={switchHeight}
              checked={checked}
              borderWidth={0}
              disabled={disabled}
              activeStyle={{
                backgroundColor: '$switchSelectedColor',
              }}
              opacity={disabled ? 0.8 : 1}
              onCheckedChange={onCheckedChange}
            >
              <UiSwitch.Thumb
                top={2}
                transition="bouncy"
                backgroundColor={checked ? '$o_color' : '$color'}
                width={21}
                height={21}
              />
            </UiSwitch>
          )}
        </>
      )}
    </XStack>
  );
};
