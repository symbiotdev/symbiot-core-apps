import { memo } from 'react';
import { Image, ImageStyle } from 'expo-image';
import { useAppScheme } from '@symbiot-core-apps/state';

export const AdaptiveLogo = memo(
  ({
    width = 180,
    style,
    forceDark,
  }: {
    width?: number;
    style?: ImageStyle;
    forceDark?: boolean;
  }) => {
    const { scheme } = useAppScheme();

    return (
      <Image
        source={
          scheme === 'light' && !forceDark
            ? require('../../../assets/images/icon/logo-light.png')
            : require('../../../assets/images/icon/logo-dark.png')
        }
        contentFit="contain"
        style={{ width: width, height: 80, ...style }}
      />
    );
  },
);
