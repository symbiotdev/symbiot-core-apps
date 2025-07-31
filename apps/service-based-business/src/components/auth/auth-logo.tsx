import { memo } from 'react';
import { Image } from 'expo-image';
import { useScheme } from '@symbiot-core-apps/state';

export const AuthLogo = memo(() => {
  const { scheme } = useScheme();

  return (
    <Image
      source={
        scheme === 'light'
          ? require('../../../assets/images/icon/logo-light.png')
          : require('../../../assets/images/icon/logo-dark.png')
      }
      style={{ width: 150, height: 90, resizeMode: 'contain' }}
    />
  );
});
