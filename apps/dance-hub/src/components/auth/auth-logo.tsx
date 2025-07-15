import { memo } from 'react';
import { Image } from 'expo-image';
import { View } from 'tamagui';
import { useSystemScheme } from '@symbiot-core-apps/shared';

export const AuthLogo = memo(() => {
  const scheme = useSystemScheme();

  return (
    <View paddingVertical="$5">
      <Image
        source={
          scheme === 'light'
            ? require('../../../assets/images/icon/light-logo.png')
            : require('../../../assets/images/icon/dark-logo.png')
        }
        style={{ width: 150, height: 90 }}
      />
    </View>
  );
});
