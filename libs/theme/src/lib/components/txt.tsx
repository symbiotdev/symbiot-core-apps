import { Platform, Text, TextProps } from 'react-native';
import { themed } from './themed';
import Animated, { AnimatedProps } from 'react-native-reanimated';

const defaultTextStyle = {
  fontFamily: 'BodyRegular',
  fontSize: 14,
  lineHeight: Platform.OS === 'web' ? 18 : undefined,
  userSelect: 'none',
  allowFontScaling: true,
};

export const Txt = themed<TextProps>(Text, defaultTextStyle);
export const AnimatedTxt = themed<AnimatedProps<TextProps>>(
  Animated.Text,
  defaultTextStyle,
);
