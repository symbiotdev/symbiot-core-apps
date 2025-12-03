import { themed } from './themed';
import { Pressable, PressableProps, ViewProps } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';

const props = {
  cursor: 'pointer',
  pressStyle: {
    opacity: 0.8,
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Press = themed<PressableProps & ViewProps>(Pressable, props);
export const APress = themed<PressableProps & AnimatedProps<ViewProps>>(
  AnimatedPressable,
  props,
);
