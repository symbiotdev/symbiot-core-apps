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
      {...viewProps}
      alignItems="center"
      gap="$4"
      flexDirection="row"
      cursor={onPress ? 'pointer' : undefined}
      pressStyle={onPress && { opacity: 0.8 }}
      onPress={(e) => {
        onPress && emitHaptic();
        onPress?.(e);
      }}
    >
      <Avatar
        name={location.name}
        size={40}
        url={location.avatarXsUrl || brand?.avatarXsUrl}
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
