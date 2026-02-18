import {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GlassView } from '../view/glass-view';
import { isCustomDesignMandatory } from '@symbiot-core-apps/theme';
import { View } from 'tamagui';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  DeviceInfo,
  emitHaptic,
  iosCornerRadiusGroups,
  isIos,
  useKeyboardDismisser,
} from '@symbiot-core-apps/shared';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';

export type SmartSheetRef = {
  show: () => void;
  hide: () => void;
};

type SmartSheetProps = PropsWithChildren<{
  trigger: ReactElement;
  excludePaddings?: boolean;
}>;

export const SmartSheet = forwardRef(
  (
    { trigger, ...props }: SmartSheetProps,
    ref: ForwardedRef<SmartSheetRef>,
  ) => {
    const [state, setState] = useState({
      modalRendered: false,
      modalVisible: false,
      sheetVisible: false,
    });

    const show = useKeyboardDismisser(
      useCallback(() => {
        emitHaptic();
        setState((prev) => ({
          ...prev,
          modalRendered: true,
          modalVisible: true,
          sheetVisible: true,
        }));
      }, []),
    );

    const hide = useKeyboardDismisser(
      useCallback(() => {
        emitHaptic();
        setState((prev) => ({ ...prev, sheetVisible: false }));
        setTimeout(
          () => setState((prev) => ({ ...prev, modalVisible: false })),
          250,
        );
      }, []),
    );

    useImperativeHandle(
      ref,
      () => ({
        show,
        hide,
      }),
      [hide, show],
    );

    return (
      <>
        <Pressable onPress={show}>{trigger}</Pressable>

        {state.modalRendered && (
          <Modal
            transparent
            animationType="none"
            visible={state.modalVisible}
            supportedOrientations={['portrait', 'landscape']}
            onRequestClose={hide}
          >
            <SheetContent
              {...props}
              visible={state.sheetVisible}
              onClose={hide}
            />
          </Modal>
        )}
      </>
    );
  },
);

const defaultBorderRadius = Object.keys(iosCornerRadiusGroups).find((key) =>
  iosCornerRadiusGroups[key].includes(DeviceInfo.modelName as string),
);
const handlerHeight = 24;
const defaultBorderTopRadius = Number(defaultBorderRadius || 50);
const defaultBorderBottomRadius = Number(defaultBorderRadius || 0);
const defaultMarginBottom = defaultBorderRadius ? 5 : -20;
const defaultHorizontalMargin = defaultBorderRadius ? 5 : -1;
const AnimatedOverlay = Animated.createAnimatedComponent(Pressable);
const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);
const SheetContent = ({
  visible,
  children,
  excludePaddings,
  onClose,
}: Omit<SmartSheetProps, 'trigger'> & {
  visible: boolean;
  onClose: () => void;
}) => {
  const { height } = useWindowDimensions();
  const { top, left, right } = useSafeAreaInsets();
  const { height: keyboardHeight$, progress: keyboardShown$ } =
    useReanimatedKeyboardAnimation();

  const y$ = useSharedValue(height);
  const height$ = useSharedValue(0);
  const overlayOpacity$ = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange(
      (event) => visible && (y$.value = Math.max(-10, event.translationY)),
    )
    .onFinalize((e) => {
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
        (excludePaddings ? 0 : Math.abs(defaultMarginBottom) + handlerHeight),
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
          marginLeft: -1,
          marginRight: -1,
          marginBottom: -1,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }
      : {
          marginLeft: defaultHorizontalMargin,
          marginRight: defaultHorizontalMargin,
          marginBottom: defaultMarginBottom,
          borderBottomLeftRadius: defaultBorderBottomRadius,
          borderBottomRightRadius: defaultBorderBottomRadius,
        }),
  }));

  const overlayAnimatedStyle = useAnimatedStyle(
    () => ({ opacity: overlayOpacity$.value }),
    [visible],
  );

  useLayoutEffect(() => {
    y$.value = withSpring(visible ? 0 : height);
    overlayOpacity$.value = withSpring(visible ? 0.3 : 0);
  }, [visible, height, y$, overlayOpacity$]);

  return (
    <GestureHandlerRootView>
      <AnimatedOverlay
        style={[
          overlayAnimatedStyle,
          StyleSheet.absoluteFill,
          { flex: 1, backgroundColor: '#111111' },
        ]}
        onPress={onClose}
      />

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
            minHeight: 200,
            maxHeight: height - top,
            borderTopLeftRadius: defaultBorderTopRadius,
            borderTopRightRadius: defaultBorderTopRadius,
            ...(!excludePaddings && {
              paddingTop: handlerHeight,
              paddingHorizontal: 14,
            }),
          },
        ]}
        onLayout={(e) => height$.set(e.nativeEvent.layout.height)}
      >
        <GestureDetector gesture={panGesture}>
          <Pressable
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: handlerHeight,
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <View
              style={{
                width: 50,
                height: 4,
                backgroundColor: '#77777750',
              }}
            />
          </Pressable>
        </GestureDetector>

        {children}
      </AnimatedGlassView>
    </GestureHandlerRootView>
  );
};
