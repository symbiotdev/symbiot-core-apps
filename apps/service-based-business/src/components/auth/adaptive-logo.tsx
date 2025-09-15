import { memo } from 'react';
import { Image, ImageStyle } from 'expo-image';
import { useScheme } from '@symbiot-core-apps/state';

export const AdaptiveLogo = memo(
  ({ width = 180, style }: { width?: number; style?: ImageStyle }) => {
    const { scheme } = useScheme();

    return (
      <Image
        source={
          scheme === 'light'
            ? require('../../../assets/images/icon/logo-light.png')
            : require('../../../assets/images/icon/logo-dark.png')
        }
        contentFit="contain"
        style={{ width: width, height: 80, ...style }}
      />
    );
  },
);
