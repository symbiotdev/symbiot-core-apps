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
import { Keyboard, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H3 } from '../text/heading';
import {
  emitHaptic,
  SCREEN_MEDIA_SIZE,
  useScreenSize,
} from '@symbiot-core-apps/shared';
import { ContainerView } from '../view/container-view';

export const popoverPadding = 24;
export const popoverHalfPadding = 12;

const adaptiveMediaSize = (
  Platform.OS !== 'web' ? 'md' : 'xs'
) as keyof AdaptWhen;

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
      ignoreHapticOnClose,
      sheetTitle,
      triggerType,
      minWidth,
      maxWidth,
      maxHeight,
      trigger,
      topFixedContent,
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
      ignoreHapticOnClose?: boolean;
      sheetTitle?: string;
      triggerType?: 'child' | 'manual';
      minWidth?: number;
      maxWidth?: number;
      maxHeight?: number;
      trigger?: ReactElement;
      topFixedContent?: ReactElement;
      onOpen?: () => void;
      onClose?: () => void;
    },
    ref: ForwardedRef<Popover>,
  ) => {
    const { media } = useScreenSize();
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

        if (
          (opened && !ignoreHapticOnOpen) ||
          (!opened && !ignoreHapticOnClose)
        ) {
          emitHaptic();
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
      [
        ignoreHapticOnOpen,
        ignoreHapticOnClose,
        onOpen,
        onClose,
        ignoreScrollTopOnClose,
      ],
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
          {SCREEN_MEDIA_SIZE[media] > SCREEN_MEDIA_SIZE[adaptiveMediaSize] &&
            !!topFixedContent && (
              <View
                width="100%"
                paddingHorizontal={popoverPadding}
                paddingTop={popoverPadding}
                paddingBottom={popoverHalfPadding}
              >
                {topFixedContent}
              </View>
            )}

          {!ignoreScroll ? (
            <Popover.ScrollView
              ref={popoverListRef}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: adjustedMaxHeight, width: '100%' }}
              contentContainerStyle={{
                paddingTop: topFixedContent ? 0 : popoverHalfPadding,
                paddingBottom: popoverHalfPadding,
                paddingHorizontal: popoverPadding,
              }}
            >
              <ContainerView children={children} />
            </Popover.ScrollView>
          ) : (
            <ContainerView children={children} />
          )}
        </Popover.Content>

        {!ignoreAdaptive && (
          <Adapt when={adaptiveMediaSize}>
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
                <View
                  width={50}
                  height={4}
                  borderRadius="$10"
                  cursor="pointer"
                  backgroundColor="$disabled"
                  marginVertical={popoverHalfPadding}
                  marginHorizontal="auto"
                />

                {!!sheetTitle && (
                  <H3
                    paddingHorizontal={popoverPadding}
                    paddingBottom={popoverHalfPadding}
                  >
                    {sheetTitle}
                  </H3>
                )}

                {!!topFixedContent && (
                  <View
                    width="100%"
                    paddingHorizontal={popoverPadding}
                    paddingBottom={popoverHalfPadding}
                  >
                    {topFixedContent}
                  </View>
                )}

                {!ignoreScroll ? (
                  <Popover.Sheet.ScrollView
                    ref={sheetListRef}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="none"
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: adjustedMaxHeight }}
                    contentContainerStyle={{
                      paddingTop:
                        sheetTitle || topFixedContent ? 0 : popoverHalfPadding,
                      paddingBottom: bottom + popoverPadding,
                      paddingHorizontal: popoverPadding,
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
