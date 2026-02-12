import { Text, TextProps } from 'react-native';
import { themed } from './themed';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import { isWeb } from '@symbiot-core-apps/shared';

const props = {
  fontFamily: 'BodyRegular',
  fontSize: 14,
  lineHeight: isWeb ? 18 : undefined,
  userSelect: 'none',
  allowFontScaling: true,
};

export const Txt = themed<TextProps>(Text, props);
export const ATxt = themed<AnimatedProps<TextProps>>(Animated.Text, props);
