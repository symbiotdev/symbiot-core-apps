import React, { PropsWithChildren, useLayoutEffect } from 'react';
import { ScrollViewProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
} from '@symbiot-core-apps/shared';
import { Overlay } from './overlay';
import { isCustomDesignMandatory } from '@symbiot-core-apps/theme';
import { SheetHandle } from './sheet-handle';
import { GlassView } from '../../view/glass-view';

const isGestureScrollLimited = isAndroid;
const defaultBorderRadius = Object.keys(iosCornerRadiusGroups).find((key) =>
  iosCornerRadiusGroups[key].includes(DeviceInfo.modelName as string),
);
const defaultBorderTopRadius = Number(defaultBorderRadius || 25);
const defaultBorderBottomRadius = Number(defaultBorderRadius || 0);
const defaultMarginBottom = defaultBorderRadius ? 5 : -20;
const defaultPaddingBottom = defaultBorderRadius ? 0 : 20;
const defaultHorizontalMargin = defaultBorderRadius ? 5 : 0;
const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

export const Sheet = ({
  visible,
  maxHeight,
  children,
  excludePaddings,
  onClose,
}: PropsWithChildren<{
  visible: boolean;
  maxHeight: number;
  excludePaddings?: boolean;
  onClose: () => void;
}>) => {
  const { top, left, right, bottom } = useSafeAreaInsets();
  const { height: keyboardHeight$, progress: keyboardShown$ } =
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
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.abs(
      keyboardHeight$.value +
        defaultPaddingBottom +
        (defaultPaddingBottom ? bottom : 0),
    ),
    ...(isIos
      ? {
          bottom: 0,
          transform: [{ translateY: y$.value }],
        }
      : {
          bottom: -y$.value,
        }),
    ...(keyboardShown$.value && defaultBorderRadius
      ? {
          marginHorizontal: -1,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }
      : {
          marginHorizontal: defaultBorderRadius ? 5 : 0,
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
            {
              left,
              right,
              position: 'absolute',
              zIndex: 1,
              borderTopLeftRadius: defaultBorderTopRadius,
              borderTopRightRadius: defaultBorderTopRadius,
              marginBottom: defaultMarginBottom,
              maxHeight:
                maxHeight - top - Math.abs(defaultHorizontalMargin * 2),
            },
          ]}
          onLayout={(e) => height$.set(e.nativeEvent.layout.height)}
        >
          <View
            style={{
              flexShrink: 1,
              overflow: 'hidden',
              borderTopLeftRadius: defaultBorderTopRadius,
              borderTopRightRadius: defaultBorderTopRadius,
              borderBottomLeftRadius: defaultBorderBottomRadius,
              borderBottomRightRadius: defaultBorderBottomRadius,
              ...(!excludePaddings && {
                paddingHorizontal: 14,
              }),
            }}
          >
            <SheetHandle
              ignorePanGesture={isGestureScrollLimited}
              panGesture={panGesture}
              onPress={() => ignoreScroll$.set(true)}
            />

            {isGestureScrollLimited
              ? children
              : React.Children.toArray(children).map((child) => {
                  if (React.isValidElement(child)) {
                    const childProps = child.props as ScrollViewProps;

                    return React.cloneElement(child, {
                      ...childProps,
                      bounces: false,
                      scrollEventThrottle: Math.min(
                        16,
                        childProps.scrollEventThrottle || 17,
                      ),
                      onScroll: (e) => {
                        childProps?.onScroll?.(e);
                        scrolled$.set(e.nativeEvent.contentOffset.y > 0);
                      },
                    } as ScrollViewProps);
                  }

                  return child;
                })}
          </View>
        </AnimatedGlassView>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
