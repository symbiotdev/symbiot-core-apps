import { useSystemScheme } from '@symbiot-core-apps/shared';
import { Image } from 'expo-image';

export const SymbiotLogo = ({ size = 40 }: { size?: number }) => {
  const scheme = useSystemScheme();

  return (
    <Image
      contentFit="contain"
      style={{ width: size, height: size }}
      source={
        scheme === 'light' ? require('./light.png') : require('./dark.png')
      }
    />
  );
};
