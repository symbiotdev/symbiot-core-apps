import { View, ViewProps } from 'react-native';
import { themed } from './themed';
import Animated, { AnimatedProps } from 'react-native-reanimated';

const AnimatedView = Animated.View;
const defaultHProps = { flexDirection: 'row' };

export const VStack = themed<ViewProps>(View);
export const HStack = themed<ViewProps>(View, defaultHProps);

export const AVStack = themed<ViewProps & AnimatedProps<ViewProps>>(
  AnimatedView,
);
export const AHStack = themed<ViewProps & AnimatedProps<ViewProps>>(
  AnimatedView,
  defaultHProps,
);
