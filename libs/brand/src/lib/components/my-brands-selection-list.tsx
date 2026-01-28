import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { XStack } from 'tamagui';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { useAuthBrand } from '../hooks/use-brand-auth';
import { Avatar, FrameView, Icon, SemiBoldText } from '@symbiot-core-apps/ui';

export const MyBrandsSelectionList = () => {
  const switchBrand = useAuthBrand();
  const { brands: currentBrands } = useCurrentBrandState();

  return (
    <FrameView gap="$1" width="100%">
      {currentBrands?.map((brand) => (
        <XStack
          key={brand.id}
          backgroundColor="$background1"
          borderRadius="$10"
          padding="$4"
          gap="$4"
          flexDirection="row"
          alignItems="center"
          cursor="pointer"
          pressStyle={{ opacity: 0.8 }}
          onPress={() => {
            emitHaptic();

            void switchBrand({ id: brand.id });
          }}
        >
          <Avatar
            name={brand.name}
            size={40}
            url={brand.avatar?.xsUrl}
            color={brand.avatarColor}
          />
          <SemiBoldText numberOfLines={1} flex={1}>
            {brand.name}
          </SemiBoldText>

          <Icon name="Login" />
        </XStack>
      ))}
    </FrameView>
  );
};
