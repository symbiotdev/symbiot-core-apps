import { View, ViewProps } from 'tamagui';
import { Platform } from 'react-native';

const height = Platform.OS === 'web' ? 2 : 1;

export const Br = (props: ViewProps) => (
  <View height={height} backgroundColor="$background" {...props} />
);
