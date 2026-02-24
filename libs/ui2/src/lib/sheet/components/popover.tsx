import { PropsWithChildren, useLayoutEffect } from 'react';
import {
  flip,
  offset,
  Placement,
  shift,
  useFloating,
} from '@floating-ui/react-native';
import { LayoutRectangle, View, ViewStyle } from 'react-native';
import { Overlay } from './overlay';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { isAndroid, isWeb } from '@symbiot-core-apps/shared';
import { isCustomDesignMandatory } from '@symbiot-core-apps/theme';
import { GlassView } from '../../glass/glass-view';

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

export const Popover = ({
  popoverOffset,
  visible,
  disabled,
  maxHeight,
  children,
  triggerRect,
  popoverPlacement,
  onClose,
}: PropsWithChildren<{
  visible: boolean;
  maxHeight: number;
  popoverOffset?: number;
  disabled?: boolean;
  popoverPlacement?: Placement;
  triggerRect: LayoutRectangle;
  onClose: () => void;
}>) => {
  const { refs, strategy, x, y } = useFloating({
    placement: popoverPlacement,
    sameScrollView: false,
    middleware: [
      flip(),
      shift(),
      ...(popoverPlacement || isWeb ? [] : []),
      ...(popoverOffset ? [offset(popoverOffset)] : []),
    ],
  });

  const y$ = useSharedValue(-20);
  const overlayOpacity$ = useSharedValue(isCustomDesignMandatory ? 0 : 0.1); // don't change initial value to 0 because glass effect is not rendering in random cases

  const overlayAnimatedStyle = useAnimatedStyle(
    () => ({
      top: y + y$.value,
      opacity: overlayOpacity$.value,
    }),
    [overlayOpacity$, y],
  );

  useLayoutEffect(() => {
    overlayOpacity$.value = withSpring(visible ? 1 : 0);
    y$.value = withSpring(visible ? (isAndroid ? 10 : 0) : -20);
  }, [visible, y$, overlayOpacity$]);

  return (
    <>
      <Overlay visible={visible} onPress={onClose} />

      <View
        collapsable={false}
        ref={refs.setReference}
        style={{
          position: 'absolute',
          top: triggerRect.y + triggerRect.height,
          left: triggerRect.x + triggerRect.width,
        }}
      />

      <AnimatedGlassView
        interactive={!isCustomDesignMandatory}
        withBackgroundColor
        style={[
          overlayAnimatedStyle,
          {
            left: x,
            borderRadius: 25,
            maxHeight: maxHeight - 50,
            minWidth: triggerRect.width,
            position: strategy as ViewStyle['position'],
            ...(disabled && {
              pointerEvents: 'none',
              opacity: 0.5,
            }),
          },
        ]}
      >
        <View
          collapsable={false}
          ref={refs.setFloating}
          style={{ flexShrink: 1, overflow: 'hidden' }}
        >
          {children}
        </View>
      </AnimatedGlassView>
    </>
  );
};
