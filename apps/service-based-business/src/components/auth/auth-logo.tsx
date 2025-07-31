import { memo } from 'react';
import { Image } from 'expo-image';
import { View } from 'tamagui';
import { useScheme } from '@symbiot-core-apps/state';

export const AuthLogo = memo(() => {
  const { scheme } = useScheme();

  return (
    <View paddingVertical="$5">
      <Image
        source={
          scheme === 'light'
            ? require('../../../assets/images/icon/logo-light.png')
            : require('../../../assets/images/icon/logo-dark.png')
        }
        style={{ width: 150, height: 90, resizeMode: 'contain' }}
      />
    </View>
  );
});
