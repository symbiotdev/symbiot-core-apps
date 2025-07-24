import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  useCallback,
  useMemo,
} from 'react';
import { Adapt, AdaptWhen, Popover, PopoverProps, View } from 'tamagui';
import {
  Keyboard,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H3 } from '../text/heading';

export const AdaptivePopover = forwardRef(
  (
    {
      children,
      ignoreAdaptive,
      ignoreScroll,
      disableDrag,
      disabled,
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
      ignoreAdaptive?: boolean;
      ignoreScroll?: boolean;
      disableDrag?: boolean;
      disabled?: boolean;
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
    const { height } = useWindowDimensions();
    const { top, bottom } = useSafeAreaInsets();

    const adjustedMaxHeight = useMemo(() => maxHeight || 500, [maxHeight]);

    const onOpenChange = useCallback(
      (opened: boolean) => {
        Keyboard.dismiss();
        setTimeout(() => (opened ? onOpen?.() : onClose?.()), 200);
      },
      [onOpen, onClose],
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

        <Popover.Content
          animation="quick"
          opacity={1}
          y={0}
          enterStyle={{ opacity: 0, y: -10 }}
          exitStyle={{ opacity: 0, y: -10 }}
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
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: adjustedMaxHeight, width: '100%' }}
            >
              {children}
            </Popover.ScrollView>
          ) : (
            children
          )}
        </Popover.Content>

        {!ignoreAdaptive && (
          <Adapt when={(Platform.OS !== 'web' ? 'md' : 'xs') as unknown as AdaptWhen}>
            <Popover.Sheet
              modal
              dismissOnSnapToBottom
              disableDrag={disableDrag}
              animation="quick"
              snapPointsMode="fit"
            >
              <Popover.Sheet.Overlay
                backgroundColor="$background1"
                animation="quick"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                opacity={0.8}
              />

              <Popover.Sheet.Frame
                borderTopLeftRadius="$10"
                borderTopRightRadius="$10"
                borderWidth={1}
                borderColor="$background"
                backgroundColor="$background"
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
                    <H3 paddingHorizontal="$5" paddingVertical="$2">
                      {sheetTitle}
                    </H3>
                  )}
                </Pressable>

                {!ignoreScroll ? (
                  <Popover.Sheet.ScrollView
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="none"
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: height - top - 50 }}
                    paddingBottom={bottom + 20}
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
