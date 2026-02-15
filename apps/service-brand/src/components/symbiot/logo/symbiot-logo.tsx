import { Image } from 'expo-image';
import { useAppScheme } from '@symbiot-core-apps/state';

export const SymbiotLogo = ({ size = 40 }: { size?: number }) => {
  const { scheme } = useAppScheme();

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
