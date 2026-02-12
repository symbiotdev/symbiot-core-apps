import { View, ViewProps } from 'tamagui';
import { isWeb } from '@symbiot-core-apps/shared';

const height = isWeb ? 2 : 1;

export const Br = (props: ViewProps) => (
  <View height={height} backgroundColor="$disabled" opacity={0.2} {...props} />
);
