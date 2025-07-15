import { memo } from 'react';
import { Image } from 'expo-image';

export const AuthLogo = memo(() => {
  return (
    <Image
      source={require('../../../assets/images/icon/logo.png')}
      style={{ width: 100, height: 100 }}
    />
  );
});
