import { Switch as UiSwitch, useTheme, View, XStack } from 'tamagui';
import { Label } from '../text/custom';
import { RegularText } from '../text/text';
import { Platform } from 'react-native';

export const Switch = ({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label?: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) => {
  const theme = useTheme();

  return (
    <XStack alignItems="flex-start" justifyContent="space-between" gap="$5">
      <View flex={1}>
        {label && (
          <Label lineHeight={Platform.OS === 'web' ? 28 : 22}>{label}</Label>
        )}

        {description && (
          <RegularText fontSize={12} color="$placeholderColor">
            {description}
          </RegularText>
        )}
      </View>

      <UiSwitch
        paddingHorizontal={2}
        height={28}
        width={42}
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
    </XStack>
  );
};
