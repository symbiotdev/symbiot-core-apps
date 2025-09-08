import { Avatar, H2, TabsPageView } from '@symbiot-core-apps/ui';
import { View } from 'tamagui';
import { useCurrentBrandState } from '@symbiot-core-apps/state';

export default () => {
  const { brand } = useCurrentBrandState();

  return (
    <TabsPageView>
      {!!brand && (
        <View margin="auto" alignItems="center" gap="$2">
          <Avatar
            name={brand.name}
            size={80}
            url={brand.avatarXsUrl}
            color={brand.avatarColor}
          />

          <H2 numberOfLines={1} textAlign="center">
            {brand.name}
          </H2>
        </View>
      )}
    </TabsPageView>
  );
};
