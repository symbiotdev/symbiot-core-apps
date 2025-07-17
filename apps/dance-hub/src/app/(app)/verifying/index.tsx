import { H3, Icon } from '@symbiot-core-apps/ui';
import { View } from 'tamagui';
import { useAccountAuthSignOut } from '@symbiot-core-apps/api';

export default () => {
  const { mutate } = useAccountAuthSignOut();

  return (
    <View flex={1} gap={10} justifyContent="center" alignItems="center">
      <H3>Exit</H3>

      <View onPress={() => mutate()}>
        <Icon.Dynamic type="Ionicons" name="exit" />
      </View>
    </View>
  );
};
