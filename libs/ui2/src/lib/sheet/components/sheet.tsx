import React, { PropsWithChildren, useLayoutEffect } from 'react';
import { ScrollViewProps, ViewStyle } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import {
  DeviceInfo,
  iosCornerRadiusGroups,
  isAndroid,
  isIos,
  useInsets,
} from '@symbiot-core-apps/shared';
import { Overlay } from './overlay';
import { isCustomDesignMandatory } from '@symbiot-core-apps/theme';
import { SheetHandle } from './sheet-handle';
import { GlassView } from '../../glass/glass-view';
import { HeaderTitle } from '../../navigation/components/header-title';

const isGestureScrollLimited = isAndroid;
const defaultBorderRadius = Object.keys(iosCornerRadiusGroups).find((key) =>
  iosCornerRadiusGroups[key].includes(DeviceInfo.modelName as string),
);
const defaultBorderTopRadius = Number(defaultBorderRadius || 40) - 10;
const defaultBorderBottomRadius = Number(defaultBorderRadius || 0);
const defaultMarginBottom = defaultBorderRadius ? 5 : -20;
const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

export const Sheet = ({
  title,
  visible,
  disabled,
  gestureDisabled,
  handleVisible = true,
  children,
  maxHeight,
  excludePaddings,
  onClose,
}: PropsWithChildren<{
  title?: string;
  visible: boolean;
  handleVisible: boolean;
  maxHeight: number;
  disabled?: boolean;
  gestureDisabled?: boolean;
  excludePaddings?: boolean;
  onClose: () => void;
}>) => {
  const { top, left, right, bottom } = useInsets();
  const { progress: keyboardShown$, height: keyboardHeight$ } =
    useReanimatedKeyboardAnimation();

  const y$ = useSharedValue(maxHeight);
  const offsetY$ = useSharedValue(0);
  const height$ = useSharedValue(0);
  const ignoreScroll$ = useSharedValue(false);
  const scrolled$ = useSharedValue(false);

  const nativeGesture = Gesture.Native();
  const panGesture = Gesture.Pan()
    .onChange((event) => {
      if (!visible) return;

      if (ignoreScroll$.value || !scrolled$.value) {
        y$.value = Math.max(
          keyboardShown$.value ? 0 : -10,
          event.translationY - offsetY$.value,
        );
      } else {
        offsetY$.value = event.translationY;
        withSpring(0);
      }
    })
    .onFinalize((e) => {
      offsetY$.value = 0;
      ignoreScroll$.value = false;

      if (!visible) return;

      const sheetHeight = height$.value;
      const divider = Math.max(Math.ceil(e.velocityY / 1000), 2);

      if (!sheetHeight || sheetHeight / divider > y$.value) {
        y$.value = withSpring(0);
      } else {
        scheduleOnRN(onClose);
      }
    })
    .enabled(!gestureDisabled && !disabled);

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.abs(keyboardHeight$.value) - bottom,
    marginBottom: keyboardShown$.value ? 0 : defaultMarginBottom,
    ...(isIos
      ? {
          bottom: 0,
          transform: [{ translateY: y$.value }],
        }
      : {
          bottom: -y$.value,
        }),
    ...(keyboardShown$.value
      ? {
          marginHorizontal: -1,
        }
      : {
          marginHorizontal: defaultBorderRadius ? 5 : 0,
        }),
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    ...(keyboardShown$.value
      ? {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }
      : {
          borderBottomLeftRadius: defaultBorderBottomRadius,
          borderBottomRightRadius: defaultBorderBottomRadius,
        }),
  }));

  useLayoutEffect(() => {
    y$.value = withSpring(visible ? 0 : maxHeight);
  }, [visible, maxHeight, y$]);

  return (
    <GestureHandlerRootView>
      <Overlay visible={visible} onPress={onClose} />

      <GestureDetector
        gesture={Gesture.Simultaneous(
          ...(isGestureScrollLimited ? [] : [nativeGesture, panGesture]),
        )}
      >
        <AnimatedGlassView
          withBackgroundColor
          interactive={!isCustomDesignMandatory}
          style={[
            sheetAnimatedStyle,
            animatedBorderStyle,
            {
              position: 'absolute',
              zIndex: 1,
              borderTopLeftRadius: defaultBorderTopRadius,
              borderTopRightRadius: defaultBorderTopRadius,
              maxHeight: maxHeight - top - 10,
              ...(disabled && {
                pointerEvents: 'none',
                opacity: 0.5,
              }),
              ...(isAndroid
                ? {
                    maxWidth: 500,
                    width: '100%',
                    alignSelf: 'center',
                  }
                : {
                    left,
                    right,
                  }),
            },
          ]}
          onLayout={(e) => height$.set(e.nativeEvent.layout.height)}
        >
          <Animated.View
            style={[
              animatedBorderStyle,
              {
                flexShrink: 1,
                overflow: 'hidden',
                paddingTop: 5,
                borderTopLeftRadius: defaultBorderTopRadius,
                borderTopRightRadius: defaultBorderTopRadius,
                ...(!excludePaddings && {
                  paddingHorizontal: 14,
                }),
              },
            ]}
          >
            {handleVisible && (
              <SheetHandle
                ignorePanGesture={!isGestureScrollLimited}
                panGesture={panGesture}
                onPress={() => ignoreScroll$.set(true)}
              />
            )}

            {!!title && (
              <HeaderTitle
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: handleVisible ? 20 : 10,
                }}
                title={title}
              />
            )}

            {React.Children.toArray(children).map((child) => {
              if (React.isValidElement(child)) {
                const childProps = child.props as ScrollViewProps;
                const paddingBottom = (
                  (Array.isArray(childProps.contentContainerStyle)
                    ? childProps.contentContainerStyle[
                        childProps.contentContainerStyle.length - 1
                      ]
                    : childProps.contentContainerStyle) as ViewStyle
                )?.paddingBottom;

                return React.cloneElement(child, {
                  ...childProps,
                  bounces: false,
                  scrollEventThrottle: Math.min(
                    16,
                    childProps.scrollEventThrottle || 17,
                  ),
                  contentContainerStyle: [
                    childProps.contentContainerStyle,
                    {
                      paddingTop: (handleVisible ? 20 : 0) + (title ? 20 : 0),
                      paddingBottom:
                        (typeof paddingBottom === 'number'
                          ? paddingBottom
                          : 0) + bottom,
                    },
                  ],
                  onScroll: (e) => {
                    childProps?.onScroll?.(e);
                    scrolled$.set(e.nativeEvent.contentOffset.y > 0);
                  },
                } as ScrollViewProps);
              }

              return child;
            })}
          </Animated.View>
        </AnimatedGlassView>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
