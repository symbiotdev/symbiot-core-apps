import React, {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {
  GestureResponderEvent,
  Keyboard,
  LayoutRectangle,
  Modal,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  emitHaptic,
  isTablet,
  isWeb,
  useScreenOrientation,
} from '@symbiot-core-apps/shared';
import { Sheet } from './components/sheet';
import { Placement } from '@floating-ui/react-native';
import { Popover } from './components/popover';

export type AdaptiveSheetRef = {
  show: () => void;
  hide: () => void;
};

type Props = PropsWithChildren<{
  trigger?: ReactElement;
  triggerDisabled?: boolean;
  disabled?: boolean;
  forceAdaptive?: 'sheet' | 'popover';
  popoverOffset?: number;
  popoverPlacement?: Placement;
  sheetTitle?: string;
  sheetGestureDisabled?: boolean;
  sheetHandleVisible?: boolean;
  excludePaddings?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}>;

export const AdaptiveSheet = forwardRef(
  (
    { trigger, triggerDisabled, disabled, onOpen, onClose, ...props }: Props,
    ref: ForwardedRef<AdaptiveSheetRef>,
  ) => {
    const [state, setState] = useState<{
      modalRendered: boolean;
      modalVisible: boolean;
      contentVisible: boolean;
      triggerRect?: LayoutRectangle;
    }>({
      modalRendered: false,
      modalVisible: false,
      contentVisible: false,
    });

    const show = useCallback(() => {
      Keyboard.dismiss();
      emitHaptic();

      // delay added to fix keyboard behavior
      setTimeout(
        () => {
          setState((prev) => ({
            ...prev,
            modalRendered: true,
            modalVisible: true,
            contentVisible: true,
          }));
          onOpen?.();
        },
        Keyboard.isVisible() ? 100 : 10,
      );
    }, [onOpen]);

    const hide = useCallback(() => {
      if (disabled) return;

      Keyboard.dismiss();
      emitHaptic();
      setState((prev) => ({ ...prev, contentVisible: false }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, modalVisible: false }));
        onClose?.();
      }, 300);
    }, [disabled, onClose]);

    const onTriggerPress = useCallback(
      (event: GestureResponderEvent) => {
        if (triggerDisabled) return;

        event.persist();

        if (event?.currentTarget?.measure) {
          event.currentTarget.measure((x, y, width, height, pageX, pageY) => {
            setState((prev) => ({
              ...prev,
              triggerRect: {
                x: pageX,
                y: pageY,
                width,
                height,
              },
            }));

            show();
          });
        } else {
          show();
        }
      },
      [triggerDisabled, show],
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
        {Boolean(trigger) && (
          <Pressable
            style={({ pressed }) => ({
              position: 'relative',
              opacity: pressed ? 0.8 : 1,
              ...((disabled || triggerDisabled) && { opacity: 0.5 }),
            })}
            onPress={onTriggerPress}
          >
            <View style={{ pointerEvents: 'none' }}>{trigger}</View>
          </Pressable>
        )}

        {state.modalRendered && (
          <AdaptiveContent
            {...props}
            disabled={disabled}
            triggerRect={state.triggerRect}
            modalVisible={state.modalVisible}
            contentVisible={state.contentVisible}
            onClose={hide}
          />
        )}
      </>
    );
  },
);

const AdaptiveContent = ({
  sheetTitle,
  sheetGestureDisabled,
  sheetHandleVisible,
  triggerRect,
  modalVisible,
  contentVisible,
  forceAdaptive,
  onClose,
  ...props
}: Omit<Props, 'trigger'> & {
  modalVisible: boolean;
  contentVisible: boolean;
  triggerRect?: LayoutRectangle;
  onClose: () => void;
}) => {
  const { height, width } = useWindowDimensions();

  useScreenOrientation({ onBeforeChange: onClose });

  return (
    <Modal
      transparent
      animationType="none"
      visible={modalVisible}
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={onClose}
    >
      {triggerRect &&
      (forceAdaptive === 'popover' || (width > 768 && (isTablet || isWeb))) ? (
        <Popover
          {...props}
          triggerRect={triggerRect}
          visible={contentVisible}
          maxHeight={Math.min(height, 600)}
          onClose={onClose}
        />
      ) : (
        <Sheet
          {...props}
          title={sheetTitle}
          maxHeight={height}
          visible={contentVisible}
          handleVisible={sheetHandleVisible !== false}
          gestureDisabled={sheetGestureDisabled}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};
