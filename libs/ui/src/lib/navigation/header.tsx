import { Platform, Pressable, StyleSheet } from 'react-native';
import { Icon } from '../icons/icon';
import { View, ViewProps, XStack } from 'tamagui';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Blur } from '../blur/blur';
import { memo, useCallback, useMemo } from 'react';
import { H4 } from '../text/heading';

const headerHeight = 50;
const headerButtonSize = 36;

export const useScreenHeaderHeight = () => {
  const { top } = useSafeAreaInsets();

  return useMemo(() => top + headerHeight, [top]);
};

export const useScreenHeaderOptions = () => {
  const { top, left, right } = useSafeAreaInsets();

  const header = useCallback(
    (props: NativeStackHeaderProps) => (
      <Header {...props} top={top} left={left} right={right} />
    ),
    [left, right, top],
  );

  return {
    header,
    headerTransparent: true,
  };
};

export const useStackScreenHeaderOptions = () => {
  const headerOptions = useScreenHeaderOptions();

  return {
    ...headerOptions,
    animation: 'slide_from_right',
  } as NativeStackNavigationOptions;
};

export const Header = memo(
  ({
    back,
    navigation,
    top,
    left,
    right,
    options,
  }: NativeStackHeaderProps & {
    top: number;
    left: number;
    right: number;
  }) => {
    const withContent =
      !!options.headerLeft ||
      !!back ||
      !!options.headerRight ||
      options.headerTitle === 'string';

    return (
      <XStack
        alignItems="center"
        justifyContent="space-between"
        gap="$5"
        position="relative"
        paddingTop={top}
        paddingLeft={left + 10}
        paddingRight={right + 10}
        height={top + (withContent ? headerHeight : 0)}
      >
        {Platform.OS !== 'android' && (
          <Blur style={StyleSheet.absoluteFillObject} />
        )}

        <SideElement
          children={
            options.headerLeft?.({}) ||
            (!!back && (
              <Pressable
                style={({ pressed }) => ({
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: pressed ? 0.8 : 1,
                })}
                onPress={navigation.goBack}
              >
                <Icon.Dynamic
                  type="Ionicons"
                  name="chevron-back-outline"
                  color="$buttonTextColor1"
                  size={24}
                />
              </Pressable>
            ))
          }
        />

        {typeof options.headerTitle === 'string' && (
          <H4 zIndex={1}>{options.headerTitle}</H4>
        )}

        <SideElement children={options.headerRight?.({})} />
      </XStack>
    );
  },
);

const SideElement = memo((props: ViewProps) => (
  <View
    zIndex={1}
    width={headerButtonSize}
    height={headerButtonSize}
    justifyContent="center"
    alignItems="center"
    {...props}
  />
));
