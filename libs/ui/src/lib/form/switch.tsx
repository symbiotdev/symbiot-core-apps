import { Switch as UiSwitch, useTheme, XStack } from 'tamagui';
import { Label } from '../text/custom';

export const Switch = ({
  label,
  checked,
  disabled,
  onChange,
}: {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) => {
  const theme = useTheme();

  return (
    <XStack alignItems="center" justifyContent="space-between" gap="$5">
      {label && <Label>{label}</Label>}

      <UiSwitch
        paddingHorizontal={2}
        height={28}
        width={42}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        backgroundColor={checked ? '$switchSelectedColor' : '$background1'}
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
