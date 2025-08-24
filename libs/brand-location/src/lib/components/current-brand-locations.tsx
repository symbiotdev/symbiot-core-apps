import {
  Avatar,
  FormView,
  Icon,
  PageView,
  RegularText,
  SemiBoldText,
} from '@symbiot-core-apps/ui';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { View, XStack } from 'tamagui';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { BrandLocation } from '@symbiot-core-apps/api';
import { router } from 'expo-router';

export const CurrentBrandLocations = ({
  locations,
}: {
  locations: BrandLocation[];
}) => {
  const { brand } = useCurrentBrandState();

  return (
    <PageView scrollable withHeaderHeight gap={2}>
      <FormView gap={2}>
        {locations.map((location) => (
          <XStack
            key={location.id}
            backgroundColor="$background1"
            borderRadius="$10"
            padding="$4"
            alignItems="center"
            gap="$4"
            cursor="pointer"
            pressStyle={{ opacity: 0.8 }}
            onPress={() => {
              emitHaptic();
              router.push(`/brand/location/update/${location.id}`);
            }}
          >
            <Avatar
              name={location.name}
              size={40}
              url={location.avatarXsUrl || brand?.avatarXsUrl}
              color={brand?.avatarColor}
            />

            <View gap="$1" flex={1}>
              <SemiBoldText numberOfLines={1}>{location.name}</SemiBoldText>
              <RegularText color="$placeholderColor" numberOfLines={1}>
                {location.address}
              </RegularText>
            </View>

            <Icon name="ArrowRight" />
          </XStack>
        ))}
      </FormView>
    </PageView>
  );
};
