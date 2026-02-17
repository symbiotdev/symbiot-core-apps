import {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
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
  iosCornerRadiusGroups,
  isWeb,
  useKeyboard,
  useKeyboardDismisser,
} from '@symbiot-core-apps/shared';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardStickyView } from 'react-native-keyboard-controller';

export type SmartSheetRef = {
  show: () => void;
  hide: () => void;
};

type SmartSheetProps = PropsWithChildren<{
  trigger: ReactElement;
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
      useCallback(
        () =>
          setState((prev) => ({
            ...prev,
            modalRendered: true,
            modalVisible: true,
            sheetVisible: true,
          })),
        [],
      ),
    );

    const hide = useKeyboardDismisser(
      useCallback(() => {
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
  iosCornerRadiusGroups[key].includes(DeviceInfo.deviceName as string),
);
const defaultBorderTopRadius = Number(defaultBorderRadius || 50);
const defaultBorderBottomRadius = Number(defaultBorderRadius || 0);
const defaultMarginBottom = defaultBorderRadius ? 5 : -20;
const defaultHorizontalMargin = defaultBorderRadius ? 5 : -1;
const AnimatedOverlay = Animated.createAnimatedComponent(Pressable);
const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);
const SheetContent = ({
  visible,
  children,
  onClose,
}: Omit<SmartSheetProps, 'trigger'> & {
  visible: boolean;
  onClose: () => void;
}) => {
  const { height } = useWindowDimensions();
  const { top, bottom, left, right } = useSafeAreaInsets();
  const { shown: keyboardShown, keyboardHeight } = useKeyboard();

  const y$ = useSharedValue(height);
  const heightRef = useRef(0);
  const panGesture = Gesture.Pan()
    .onChange(
      (event) => visible && (y$.value = Math.max(-10, event.translationY)),
    )
    .onFinalize(() => {
      if (!visible) return;

      const sheetHeight = heightRef.current;

      if (!sheetHeight || sheetHeight / 2 > y$.value) {
        y$.value = withSpring(0);
      } else {
        scheduleOnRN(onClose);
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() =>
    isWeb
      ? { bottom: -y$.value }
      : { bottom: 0, transform: [{ translateY: y$.value }] },
  );

  const overlayAnimatedStyle = useAnimatedStyle(
    () => ({ opacity: withSpring(visible ? 1 : 0) }),
    [visible],
  );

  useLayoutEffect(() => {
    y$.value = withSpring(visible ? 0 : height);
  }, [y$, visible, height]);

  return (
    <GestureHandlerRootView>
      <AnimatedOverlay
        style={[
          overlayAnimatedStyle,
          StyleSheet.absoluteFill,
          { flex: 1, backgroundColor: 'rgba(17, 17, 17, .4)' },
        ]}
        onPress={onClose}
      />

      <KeyboardStickyView
        offset={{ opened: bottom }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      >
        <AnimatedGlassView
          interactive={!isCustomDesignMandatory}
          style={[
            sheetAnimatedStyle,
            {
              left,
              right,
              position: 'absolute',
              zIndex: 1,
              minHeight: 200,
              paddingHorizontal: 14,
              marginBottom: defaultMarginBottom,
              marginLeft: defaultHorizontalMargin,
              marginRight: defaultHorizontalMargin,
              maxHeight: height - top - keyboardHeight,
              borderTopLeftRadius: defaultBorderTopRadius,
              borderTopRightRadius: defaultBorderTopRadius,
              borderBottomLeftRadius: defaultBorderBottomRadius,
              borderBottomRightRadius: defaultBorderBottomRadius,
              ...(keyboardShown && {
                marginLeft: -1,
                marginRight: -1,
                marginBottom: -1,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              }),
            },
          ]}
          onLayout={(e) => (heightRef.current = e.nativeEvent.layout.height)}
        >
          <GestureDetector gesture={panGesture}>
            <Pressable style={{ padding: 12, alignItems: 'center' }}>
              <View
                style={{
                  width: 50,
                  height: 4,
                  backgroundColor: '#555555',
                }}
              />
            </Pressable>
          </GestureDetector>

          {children}
        </AnimatedGlassView>
      </KeyboardStickyView>
    </GestureHandlerRootView>
  );
};
