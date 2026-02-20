import { BaseSyntheticEvent, memo, ReactElement, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isIos } from '@symbiot-core-apps/shared';
import { XStack } from 'tamagui';
import { HeaderSideElement } from './header-side-element';
import { HeaderButton } from './header-button';
import { HeaderTitle } from './header-title';
import { headerHeight, headerHorizontalPadding } from './header';
import { GlassView } from '@symbiot-core-apps/ui2';

export const ModalHeader = memo(
  ({
    height,
    headerLeft,
    relative,
    headerTitle,
    headerRight,
    onClose,
  }: {
    height?: number;
    relative?: boolean;
    headerLeft?: () => ReactElement;
    headerTitle?: string | (() => ReactElement);
    headerRight?: () => ReactElement;
    onClose?: (e: BaseSyntheticEvent) => void;
  }) => {
    const { top, left, right } = useSafeAreaInsets();

    const adjustedTop = useMemo(() => (isIos ? 5 : top), [top]);

    const adjustedHeight = adjustedTop + (height || headerHeight);

    return (
      <XStack
        zIndex={1}
        {...(!relative && {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        })}
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        gap="$2"
        paddingTop={adjustedTop}
        height={adjustedHeight}
        maxHeight={adjustedHeight}
        paddingLeft={left + headerHorizontalPadding}
        paddingRight={right + headerHorizontalPadding}
      >
        <HeaderSideElement alignItems="flex-start" children={headerLeft?.()} />

        {!!headerTitle && (
          <GlassView
            interactive={typeof headerTitle === 'function'}
            style={{
              zIndex: 1,
              borderRadius: 20,
              paddingVertical: 5,
              paddingHorizontal: 10,
              minHeight: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {typeof headerTitle === 'string' && (
              <HeaderTitle title={headerTitle} />
            )}

            {typeof headerTitle === 'function' && headerTitle()}
          </GlassView>
        )}

        <HeaderSideElement
          alignItems="flex-end"
          children={
            typeof headerRight === 'function' ? (
              headerRight()
            ) : (
              <HeaderButton iconName="Close" onPress={onClose} />
            )
          }
        />
      </XStack>
    );
  },
);
