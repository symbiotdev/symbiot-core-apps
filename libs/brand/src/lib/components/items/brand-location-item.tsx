import { Brand, BrandLocation } from '@symbiot-core-apps/api';
import { emitHaptic } from '@symbiot-core-apps/shared';
import {
  Avatar,
  FormView,
  Icon,
  RegularText,
  SemiBoldText,
} from '@symbiot-core-apps/ui';
import { View, ViewProps } from 'tamagui';

export const BrandLocationItem = ({
  location,
  brand,
  hideArrow,
  onPress,
  ...viewProps
}: ViewProps & {
  location: BrandLocation;
  brand?: Brand;
  hideArrow?: boolean;
}) => {
  return (
    <FormView
      alignItems="center"
      gap="$4"
      flexDirection="row"
      disabledStyle={{ opacity: 0.5 }}
      {...viewProps}
      {...(onPress && !viewProps.disabled && {
        cursor: 'pointer',
        pressStyle: { opacity: 0.8 },
        onPress: (e) => {
          emitHaptic();
          onPress?.(e);
        },
      })}
    >
      <Avatar
        name={location.name}
        size={40}
        url={location.avatar?.xsUrl || brand?.avatar?.xsUrl}
      />

      <View gap="$1" flex={1}>
        <SemiBoldText numberOfLines={1}>{location.name}</SemiBoldText>
        <RegularText color="$placeholderColor" numberOfLines={1}>
          {location.address}
        </RegularText>
      </View>

      {!hideArrow && <Icon name="ArrowRight" />}
    </FormView>
  );
};
