import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Adapt,
  AdaptWhen,
  Popover,
  PopoverProps,
  ScrollView,
  View,
} from 'tamagui';
import {
  Keyboard,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H3 } from '../text/heading';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useRendered, useScreenSize } from '@symbiot-core-apps/shared';

export const adaptivePopoverSheetPadding = 24;

export const AdaptivePopover = forwardRef(
  (
    {
      children,
      disableDrag,
      disabled,
      ignoreAdaptive,
      ignoreScroll,
      ignoreScrollTopOnClose,
      ignoreHapticOnOpen,
      sheetTitle,
      triggerType,
      minWidth,
      maxWidth,
      maxHeight,
      trigger,
      onOpen,
      onClose,
      ...popoverProps
    }: PopoverProps & {
      disableDrag?: boolean;
      disabled?: boolean;
      ignoreAdaptive?: boolean;
      ignoreScroll?: boolean;
      ignoreScrollTopOnClose?: boolean;
      ignoreHapticOnOpen?: boolean;
      sheetTitle?: string;
      triggerType?: 'child' | 'manual';
      minWidth?: number;
      maxWidth?: number;
      maxHeight?: number;
      trigger: ReactElement;
      onOpen?: () => void;
      onClose?: () => void;
    },
    ref: ForwardedRef<Popover>,
  ) => {
    const { isSmall } = useScreenSize();
    const { rendered } = useRendered({ delay: 500 });
    const { height } = useWindowDimensions();
    const { top, bottom, left, right } = useSafeAreaInsets();

    const popoverListRef = useRef<ScrollView>(null);
    const sheetListRef = useRef<ScrollView>(null);

    const adjustedMaxHeight = useMemo(
      () => Math.min(maxHeight || 500, height - top - 50),
      [height, maxHeight, top],
    );

    const onOpenChange = useCallback(
      (opened: boolean) => {
        Keyboard.dismiss();

        if (opened && !ignoreHapticOnOpen) {
          void impactAsync(ImpactFeedbackStyle.Light);
        }

        setTimeout(() => {
          if (opened) {
            onOpen?.();
          } else {
            onClose?.();

            if (!ignoreScrollTopOnClose) {
              sheetListRef.current?.scrollTo({
                y: 0,
                animated: false,
              });

              popoverListRef.current?.scrollTo({
                y: 0,
                animated: false,
              });
            }
          }
        }, 200);
      },
      [onOpen, ignoreHapticOnOpen, onClose, ignoreScrollTopOnClose],
    );

    return (
      <Popover
        ref={ref}
        stayInFrame
        allowFlip
        resize
        placement="bottom-start"
        offset={5}
        onOpenChange={onOpenChange}
        {...popoverProps}
      >
        {triggerType === 'manual' || disabled ? (
          trigger
        ) : (
          <Popover.Trigger
            asChild={triggerType === 'child'}
            disabled={disabled}
          >
            {trigger}
          </Popover.Trigger>
        )}

        {rendered && (
          <Popover.Content
            animation={!isSmall ? 'quick' : undefined}
            enterStyle={{ opacity: 0, y: -10 }}
            exitStyle={{ opacity: 0, y: -10 }}
            opacity={1}
            y={0}
            backgroundColor="$background1"
            borderRadius="$10"
            maxHeight={adjustedMaxHeight}
            width={maxWidth}
            minWidth={minWidth}
            padding={0}
            zIndex={100_000}
          >
            {!ignoreScroll ? (
              <Popover.ScrollView
                ref={popoverListRef}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: adjustedMaxHeight, width: '100%' }}
                contentContainerStyle={{
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                }}
              >
                {children}
              </Popover.ScrollView>
            ) : (
              children
            )}
          </Popover.Content>
        )}

        {!ignoreAdaptive && rendered && (
          <Adapt
            when={(Platform.OS !== 'web' ? 'md' : 'xs') as unknown as AdaptWhen}
          >
            <Popover.Sheet
              modal
              dismissOnSnapToBottom
              disableDrag={disableDrag}
              animation="quick"
              snapPointsMode="fit"
            >
              <Popover.Sheet.Overlay
                backgroundColor="$background"
                animation="quick"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                opacity={0.8}
              />

              <Popover.Sheet.Frame
                borderTopLeftRadius="$10"
                borderTopRightRadius="$10"
                backgroundColor="$background1"
                position="relative"
                paddingLeft={left}
                paddingRight={right}
              >
                <Pressable disabled={Platform.OS === 'web'}>
                  <View
                    width={50}
                    height={4}
                    borderRadius="$10"
                    backgroundColor="$disabled"
                    marginVertical={10}
                    marginHorizontal="auto"
                  />

                  {!!sheetTitle && (
                    <H3 paddingHorizontal={24} paddingBottom={24 / 2}>
                      {sheetTitle}
                    </H3>
                  )}
                </Pressable>

                {!ignoreScroll ? (
                  <Popover.Sheet.ScrollView
                    ref={sheetListRef}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="none"
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: adjustedMaxHeight }}
                    contentContainerStyle={{
                      paddingTop: sheetTitle
                        ? 0
                        : adaptivePopoverSheetPadding / 2,
                      paddingBottom: bottom + adaptivePopoverSheetPadding,
                      paddingHorizontal: adaptivePopoverSheetPadding,
                    }}
                  >
                    <Adapt.Contents />
                  </Popover.Sheet.ScrollView>
                ) : (
                  <Adapt.Contents />
                )}
              </Popover.Sheet.Frame>
            </Popover.Sheet>
          </Adapt>
        )}
      </Popover>
    );
  },
);
