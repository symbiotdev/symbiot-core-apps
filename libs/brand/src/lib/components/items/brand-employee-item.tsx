import { BrandEmployee } from '@symbiot-core-apps/api';
import { emitHaptic } from '@symbiot-core-apps/shared';
import {
  Avatar,
  FrameView,
  Icon,
  MediumText,
  RegularText,
} from '@symbiot-core-apps/ui';
import { View, ViewProps } from 'tamagui';

export const BrandEmployeeItem = ({
  employee,
  hideArrow,
  onPress,
  ...viewProps
}: ViewProps & {
  employee: BrandEmployee;
  hideArrow?: boolean;
}) => {
  return (
    <FrameView
      alignItems="center"
      gap="$4"
      flexDirection="row"
      disabledStyle={{ opacity: 0.5 }}
      {...viewProps}
      {...(onPress &&
        !viewProps.disabled && {
          cursor: 'pointer',
          pressStyle: { opacity: 0.8 },
          onPress: (e) => {
            emitHaptic();
            onPress?.(e);
          },
        })}
    >
      <Avatar
        name={employee.name}
        size={40}
        url={employee.avatar?.xsUrl}
        color={employee.avatarColor}
      />

      <View gap="$1" flex={1}>
        <MediumText numberOfLines={1}>{employee.name}</MediumText>
        <RegularText
          color="$placeholderColor"
          numberOfLines={1}
          lineHeight={20}
        >
          {employee.role}
        </RegularText>
      </View>

      {!!onPress && !hideArrow && <Icon name="ArrowRight" />}
    </FrameView>
  );
};
