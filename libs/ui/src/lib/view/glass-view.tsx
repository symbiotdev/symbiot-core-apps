import { StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { GlassView as ExpoGlassView } from 'expo-glass-effect';
import { isCustomDesignMandatory } from '@symbiot-core-apps/theme';
import { useAppScheme } from '@symbiot-core-apps/state';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { isIos } from '@symbiot-core-apps/shared';
import { BlurView as ExpoBlurView } from 'expo-blur';

type Props = Omit<ViewProps, 'style'> & {
  style?: ViewStyle;
  interactive?: boolean;
};

const GlassNativeView = (props: Props) => {
  const { scheme } = useAppScheme();

  return (
    <ExpoGlassView
      {...props}
      colorScheme={scheme}
      isInteractive={props.interactive}
    />
  );
};

export const GlassLikeView = ({ children, ...props }: Props) => {
  const { scheme } = useAppScheme();

  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withTiming(pressed.value ? 1.1 : 1, {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    }),
    [],
  );

  return (
    <Animated.View
      {...props}
      style={[
        animatedStyle,
        {
          borderWidth: 1,
          borderColor: '#FFFFFF30',
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          ...(!isIos && {
            backgroundColor:
              scheme === 'light'
                ? 'rgba(250, 250, 250, .9)'
                : 'rgba(17, 17, 17, .9)',
          }),
        },
        props.style,
      ]}
      {...(props.interactive && {
        onTouchStart: (e) => {
          pressed.set(true);
          props.onTouchStart?.(e);
        },
        onTouchEnd: (e) => {
          pressed.set(false);
          props.onTouchEnd?.(e);
        },
        onTouchCancel: (e) => {
          pressed.set(false);
          props.onTouchCancel?.(e);
        },
        onPointerDown: (e) => {
          pressed.set(true);
          props.onPointerDown?.(e);
        },
        onPointerLeave: (e) => {
          pressed.set(false);
          props.onPointerLeave?.(e);
        },
      })}
    >
      {isIos && <ExpoBlurView tint={scheme} style={StyleSheet.absoluteFill} />}

      {children}
    </Animated.View>
  );
};

export const GlassView = isCustomDesignMandatory
  ? GlassLikeView
  : GlassNativeView;

export const GlassViewBackground = ({ style, ...props }: Props) => (
  <GlassView
    {...props}
    style={{
      ...StyleSheet.absoluteFill,
      ...style,
    }}
  />
);
