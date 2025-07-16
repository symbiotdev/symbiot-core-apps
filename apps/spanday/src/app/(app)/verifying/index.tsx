import { Button, Icon } from '@symbiot-core-apps/ui';
import { View } from 'tamagui';
import { useAccountAuthSignOut } from '@symbiot-core-apps/api';

export default () => {
  const { mutate } = useAccountAuthSignOut();

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Button
        type="outlined"
        width="auto"
        icon={<Icon.Dynamic type="Ionicons" name="exit" />}
        onPress={() => mutate()}
      />
    </View>
  );
};
