import { View, ViewProps } from 'react-native';
import { themed } from './themed';
import Animated, { AnimatedProps } from 'react-native-reanimated';

const AnimatedView = Animated.View;
const HProps = { flexDirection: 'row' };

export const VStack = themed(View);
export const HStack = themed(View, HProps);

export const AVStack = themed<AnimatedProps<ViewProps>>(AnimatedView);
export const AHStack = themed<AnimatedProps<ViewProps>>(AnimatedView, HProps);
