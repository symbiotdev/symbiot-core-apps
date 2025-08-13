import { memo } from 'react';
import { Image, ImageStyle } from 'expo-image';
import { useScheme } from '@symbiot-core-apps/state';

export const AdaptiveLogo = memo(
  ({ size = 100, style }: { size?: number; style?: ImageStyle }) => {
    const { scheme } = useScheme();

    return (
      <Image
        source={
          scheme === 'light'
            ? require('../../../assets/images/icon/logo-light.png')
            : require('../../../assets/images/icon/logo-dark.png')
        }
        contentFit="contain"
        style={{ width: size, height: size, ...style }}
      />
    );
  },
);
