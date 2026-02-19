import { View, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { memo, useCallback, useMemo } from 'react';
import { isAndroid, isWeb, SystemScheme } from '@symbiot-core-apps/shared';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { useAppScheme } from '@symbiot-core-apps/state';
import { GlassView } from '../view/glass-view';
import { HeaderSideElement } from './header-side-element';
import { HeaderTitle } from './header-title';
import { HeaderButton } from './header-button';

export const headerHeight = 50;
export const headerButtonSize = 24;
export const headerHorizontalPadding = 14;
export const headerBackButtonIconName = 'ArrowLeft';

export const useScreenHeaderHeight = () => {
  const { top } = useSafeAreaInsets();

  return useMemo(() => top + headerHeight, [top]);
};

export const useScreenHeaderOptions = () => {
  const { scheme } = useAppScheme();
  const { top, left, right } = useSafeAreaInsets();

  return {
    headerTransparent: true,
    header: useCallback(
      (props: NativeStackHeaderProps) => (
        <ScreenHeader
          {...props}
          top={top}
          left={left}
          right={right}
          scheme={scheme}
        />
      ),
      [left, right, top, scheme],
    ),
  } as NativeStackNavigationOptions;
};

export const useStackScreenHeaderOptions = () => {
  const headerOptions = useScreenHeaderOptions();

  return {
    ...headerOptions,
    ...(isAndroid && {
      animation: 'slide_from_right',
    }),
  } as NativeStackNavigationOptions;
};

const shadowSize = isAndroid ? 25 : 50;

export const ScreenHeader = memo(
  ({
    back,
    navigation,
    top,
    left,
    right,
    options,
    scheme,
  }: NativeStackHeaderProps & {
    top: number;
    left: number;
    right: number;
    scheme: SystemScheme;
  }) => {
    const withContent =
      !!options.headerLeft ||
      !!back ||
      !!options.headerRight ||
      typeof options.headerTitle === 'string' ||
      typeof options.headerTitle === 'function';

    return (
      <>
        {!isWeb && (
          <View
            position="absolute"
            top={-shadowSize * 2}
            left={-shadowSize}
            right={-shadowSize}
            height={shadowSize * 2}
            boxShadow={`0 ${shadowSize}px ${shadowSize}px ${scheme === 'dark' ? '#000000' : '#FFFFFF'}`}
          />
        )}

        <XStack
          gap="$2"
          position="relative"
          alignItems="center"
          justifyContent="space-between"
          zIndex={1}
          paddingTop={top}
          paddingLeft={left + headerHorizontalPadding}
          paddingRight={right + headerHorizontalPadding}
          height={top + (withContent ? headerHeight : 0)}
        >
          <HeaderSideElement
            alignItems="flex-start"
            children={
              typeof options.headerLeft === 'function'
                ? options.headerLeft({})
                : !!back && (
                    <HeaderButton
                      iconName={headerBackButtonIconName}
                      onPress={navigation.goBack}
                    />
                  )
            }
          />

          {!!options.headerTitle && (
            <GlassView
              interactive={typeof options.headerTitle === 'function'}
              style={{
                zIndex: 1,
                borderRadius: 20,
                paddingVertical: 5,
                paddingHorizontal: 10,
                minHeight: 40,
                flexShrink: 1,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {typeof options.headerTitle === 'string' && (
                <HeaderTitle title={options.headerTitle} />
              )}

              {typeof options.headerTitle === 'function' &&
                options.headerTitle({ children: '' })}
            </GlassView>
          )}

          <HeaderSideElement
            alignItems="flex-end"
            children={options.headerRight?.({})}
          />
        </XStack>
      </>
    );
  },
);
