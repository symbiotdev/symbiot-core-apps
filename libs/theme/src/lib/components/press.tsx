import { themed } from './themed';
import { Pressable, ViewProps } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';

const defaultProps = {
  cursor: 'pointer',
  pressStyle: {
    opacity: 0.8,
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Press = themed<ViewProps>(Pressable, defaultProps);
export const APress = themed<ViewProps & AnimatedProps<ViewProps>>(
  AnimatedPressable,
  defaultProps,
);
