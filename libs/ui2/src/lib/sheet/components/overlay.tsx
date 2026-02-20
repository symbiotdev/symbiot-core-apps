import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable, StyleSheet } from 'react-native';
import { useLayoutEffect } from 'react';

const AnimatedOverlay = Animated.createAnimatedComponent(Pressable);

export const Overlay = ({
  visible,
  onPress,
}: {
  visible: boolean;
  onPress: () => void;
}) => {
  const overlayOpacity$ = useSharedValue(0);

  const overlayAnimatedStyle = useAnimatedStyle(
    () => ({ opacity: overlayOpacity$.value }),
    [],
  );

  useLayoutEffect(() => {
    overlayOpacity$.value = withSpring(visible ? 0.4 : 0);
  }, [visible, overlayOpacity$]);

  return (
    <AnimatedOverlay
      style={[
        overlayAnimatedStyle,
        StyleSheet.absoluteFill,
        { flex: 1, backgroundColor: '#111111' },
      ]}
      onPress={onPress}
    />
  );
};
