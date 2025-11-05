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
  onPress,
  ...viewProps
}: ViewProps & {
  location: BrandLocation;
  brand?: Brand;
}) => {
  return (
    <FormView
      alignItems="center"
      gap="$4"
      flexDirection="row"
      {...viewProps}
      {...(onPress && {
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

      <Icon name="ArrowRight" />
    </FormView>
  );
};
