import { Button, Icon } from '@symbiot-core-apps/ui';
import { View } from 'tamagui';
import { useAccountAuthSignOut } from '@symbiot-core-apps/api';
import { router } from 'expo-router';
import { useLayoutEffect } from 'react';

export default () => {
  const { mutate } = useAccountAuthSignOut();

  useLayoutEffect(() => {
    router.replace('/home', {});
  }, []);

  return (
    <View flex={1} gap={10} justifyContent="center" alignItems="center">
      <Button
        type="outlined"
        label="Exit"
        icon={<Icon.Dynamic type="Ionicons" name="exit" />}
        onPress={() => mutate()}
      />
    </View>
  );
};
