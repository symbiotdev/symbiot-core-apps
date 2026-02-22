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
} from 'react-native';
import {
  emitHaptic,
  isTablet,
  isWeb,
  useKeyboardDismisser,
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
    { trigger, disabled, onOpen, onClose, ...props }: Props,
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

    const show = useKeyboardDismisser(
      useCallback(() => {
        emitHaptic();
        setState((prev) => ({
          ...prev,
          modalRendered: true,
          modalVisible: true,
          contentVisible: true,
        }));
        onOpen?.();
      }, [onOpen]),
    );

    const hide = useKeyboardDismisser(
      useCallback(() => {
        if (disabled) return;

        emitHaptic();
        setState((prev) => ({ ...prev, contentVisible: false }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, modalVisible: false }));
          onClose?.();
        }, 300);
      }, [disabled, onClose]),
    );

    const onTriggerPress = useCallback(
      (event: GestureResponderEvent) => {
        Keyboard.dismiss();
        emitHaptic();
        event.persist();

        if (event?.currentTarget?.measure) {
          event.currentTarget.measure((x, y, width, height, pageX, pageY) => {
            setState((prev) => ({
              ...prev,
              modalRendered: true,
              modalVisible: true,
              contentVisible: true,
              triggerRect: {
                x: pageX,
                y: pageY,
                width,
                height,
              },
            }));
          });
        } else {
          show();
        }
      },
      [show],
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
          <Pressable style={{ position: 'relative' }} onPress={onTriggerPress}>
            {trigger}
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
          maxHeight={height}
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
