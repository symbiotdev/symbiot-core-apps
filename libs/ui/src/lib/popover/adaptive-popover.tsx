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
  useTheme,
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
import { NavigationBackground } from '../navigation/background';

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
      unmountChildrenWhenHidden,
      sheetTitle,
      triggerType,
      minWidth,
      maxWidth,
      maxHeight = 600,
      hideHandle,
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
      unmountChildrenWhenHidden?: boolean;
      sheetTitle?: string;
      triggerType?: 'manual';
      minWidth?: number;
      maxWidth?: number;
      maxHeight?: number;
      hideHandle?: boolean;
      trigger?: ReactElement;
      topFixedContent?: ReactElement;
      onOpen?: () => void;
      onClose?: () => void;
    },
    ref: ForwardedRef<AdaptivePopoverRef>,
  ) => {
    const { media } = useScreenSize();
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const { top, bottom, left, right } = useSafeAreaInsets();
    const { rendered } = useRendered({
      delay: unmountChildrenWhenHidden ? 100 : 500,
    });

    const popoverListRef = useRef<ScrollView>(null);
    const sheetListRef = useRef<ScrollView>(null);

    const [opened, setOpened] = useState(false);

    const adjustedMaxHeight = useMemo(
      () => Math.min(maxHeight, height - top - 50),
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
          overflow="hidden"
          backgroundColor="transparent"
          borderColor={theme.$background1?.val}
          borderWidth={1}
          borderRadius={30}
          maxHeight={adjustedMaxHeight}
          width={maxWidth}
          minWidth={minWidth}
          padding={0}
          zIndex={100_000}
        >
          {SCREEN_MEDIA_SIZE[media] > SCREEN_MEDIA_SIZE[adaptiveMediaSize] && (
            <>
              <NavigationBackground />

              {!!topFixedContent && (
                <View
                  width="100%"
                  paddingHorizontal={defaultPageHorizontalPadding}
                  paddingVertical={defaultPageVerticalPadding}
                >
                  {topFixedContent}
                </View>
              )}
            </>
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
              unmountChildrenWhenHidden={unmountChildrenWhenHidden}
              dismissOnOverlayPress={!disabled}
              disableDrag={disableDrag}
              animation="quickest"
              snapPointsMode="fit"
            >
              <Popover.Sheet.Overlay
                backgroundColor="$overlay"
                animation="quickest"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                opacity={1}
              >
                <NavigationBackground
                  opacity={0}
                  backgroundColor="transparent"
                />
              </Popover.Sheet.Overlay>

              <NavigationBackground
                backgroundColor="$background1"
                borderColor={theme.$background1?.val}
                borderWidth={1}
                height="120%"
                borderRadius={30}
                blurStyle={{
                  height: '120%',
                  borderRadius: 30,
                }}
              />

              <Popover.Sheet.Frame
                backgroundColor="transparent"
                borderBottomWidth={0}
                paddingLeft={left}
                paddingRight={right}
              >
                {!hideHandle ? (
                  !disableDrag ? (
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
                    <View height={defaultPageVerticalPadding * 2 + 2} />
                  )
                ) : (
                  <View />
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
                    bounces={false} // temp fix
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
