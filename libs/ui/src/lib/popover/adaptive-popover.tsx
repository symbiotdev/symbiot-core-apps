import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Adapt,
  AdaptWhen,
  Popover,
  PopoverProps,
  ScrollView,
  View,
} from 'tamagui';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H4 } from '../text/heading';
import {
  emitHaptic,
  SCREEN_MEDIA_SIZE,
  useKeyboardDismisser,
  useRendered,
  useScreenSize,
} from '@symbiot-core-apps/shared';
import { ContainerView } from '../view/container-view';
import {
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
} from '../view/page-view';

const adaptiveMediaSize = (
  Platform.OS === 'web' ? 'md' : 'xl'
) as keyof AdaptWhen;

export type AdaptivePopoverRef = {
  open: () => void;
  close: () => void;
  scrollTo: (y: number, animated?: boolean) => void;
};

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
    }: Omit<PopoverProps, 'open' | 'onOpenChange'> & {
      disableDrag?: boolean;
      disabled?: boolean;
      ignoreAdaptive?: boolean;
      ignoreScroll?: boolean;
      ignoreScrollTopOnClose?: boolean;
      ignoreHapticOnOpen?: boolean;
      ignoreHapticOnClose?: boolean;
      sheetTitle?: string;
      triggerType?: 'manual';
      minWidth?: number;
      maxWidth?: number;
      maxHeight?: number;
      trigger?: ReactElement;
      topFixedContent?: ReactElement;
      onOpen?: () => void;
      onClose?: () => void;
    },
    ref: ForwardedRef<AdaptivePopoverRef>,
  ) => {
    const { media } = useScreenSize();
    const { height } = useWindowDimensions();
    const { top, bottom, left, right } = useSafeAreaInsets();
    const { rendered } = useRendered({ delay: 500 });

    const popoverListRef = useRef<ScrollView>(null);
    const sheetListRef = useRef<ScrollView>(null);

    const [opened, setOpened] = useState(false);

    const adjustedMaxHeight = useMemo(
      () => Math.min(maxHeight || 500, height - top - 50),
      [height, maxHeight, top],
    );

    const open = useCallback(() => setOpened(true), []);
    const close = useCallback(() => setOpened(false), []);
    const scrollTo = useCallback((y: number, animated?: boolean) => {
      popoverListRef.current?.scrollTo({ y, animated: !!animated });
      sheetListRef.current?.scrollTo({ y, animated: !!animated });
    }, []);

    const onOpenChange = useKeyboardDismisser(
      useCallback(
        (opened: boolean) => {
          const delay = 200;

          setOpened(opened);

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
          }, delay);
        },
        [
          ignoreHapticOnOpen,
          ignoreHapticOnClose,
          onOpen,
          onClose,
          ignoreScrollTopOnClose,
        ],
      ),
    );

    useImperativeHandle(ref, () => ({
      open,
      close,
      scrollTo,
    }));

    return (
      <Popover
        stayInFrame
        allowFlip
        resize
        placement="bottom-start"
        offset={5}
        {...popoverProps}
        open={opened}
        onOpenChange={onOpenChange}
      >
        {!!trigger && (
          <Popover.Trigger
            asChild={triggerType !== 'manual'}
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
                paddingHorizontal={defaultPageHorizontalPadding}
                paddingVertical={defaultPageVerticalPadding}
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
              style={{
                maxHeight: adjustedMaxHeight,
                width: '100%',
              }}
              contentContainerStyle={{
                paddingTop: topFixedContent ? 0 : defaultPageVerticalPadding,
                paddingBottom: defaultPageHorizontalPadding,
                paddingHorizontal: defaultPageHorizontalPadding,
              }}
            >
              <ContainerView children={children} />
            </Popover.ScrollView>
          ) : (
            <ContainerView children={children} />
          )}
        </Popover.Content>

        {!ignoreAdaptive && rendered && (
          <Adapt when={adaptiveMediaSize}>
            <Popover.Sheet
              modal
              dismissOnSnapToBottom
              dismissOnOverlayPress={!disabled}
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
                {!disableDrag ? (
                  <View
                    width={50}
                    height={4}
                    borderRadius="$10"
                    cursor="pointer"
                    backgroundColor="$disabled"
                    marginVertical={defaultPageVerticalPadding}
                    marginHorizontal="auto"
                  />
                ) : (
                  <View height={defaultPageVerticalPadding * 2} />
                )}

                {!!sheetTitle && (
                  <H4
                    textAlign="center"
                    paddingHorizontal={defaultPageHorizontalPadding}
                    paddingBottom={defaultPageVerticalPadding}
                  >
                    {sheetTitle}
                  </H4>
                )}

                {!!topFixedContent && (
                  <View
                    width="100%"
                    paddingHorizontal={defaultPageHorizontalPadding}
                    paddingBottom={defaultPageVerticalPadding}
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
                      paddingBottom: bottom + defaultPageHorizontalPadding,
                      paddingHorizontal: defaultPageHorizontalPadding,
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
