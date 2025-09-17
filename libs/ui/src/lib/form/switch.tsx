import { Switch as UiSwitch, useTheme, View, XStack } from 'tamagui';
import { Label } from '../text/custom';
import { RegularText } from '../text/text';
import { Platform } from 'react-native';
import { Spinner } from '../loading/spinner';

const switchHeight = Platform.OS === 'web' ? 28 : 30;
const switchWidth = Platform.OS === 'ios' ? 62 : 42;

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

  return (
    <XStack alignItems="flex-start" justifyContent="space-between" gap="$5">
      {(!!label || !!description) && (
        <View flex={1}>
          {label && (
            <Label lineHeight={switchHeight} flex={1}>
              {label} {required ? '*' : ''}
            </Label>
          )}

          {description && (
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
        <View height={switchHeight} width={switchWidth} alignItems="flex-end">
          <UiSwitch
            paddingHorizontal={2}
            cursor="pointer"
            checked={checked}
            disabled={disabled}
            onCheckedChange={onChange}
            backgroundColor={checked ? '$switchSelectedColor' : '$background1'}
            opacity={disabled ? 0.8 : 1}
            native
            nativeProps={{
              disabled,
              trackColor: {
                false: theme.background1?.val,
                true: theme.switchSelectedColor?.val,
              },
            }}
          >
            <UiSwitch.Thumb
              top={1}
              backgroundColor={checked ? '$o_color' : '$color'}
              animation="bouncy"
              width={20}
              height={20}
            />
          </UiSwitch>
        </View>
      )}
    </XStack>
  );
};
