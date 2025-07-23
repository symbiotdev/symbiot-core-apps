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
  const headerHeight = useScreenHeaderHeight();
  const { left, right } = useSafeAreaInsets();

  const header = useCallback(
    (props: NativeStackHeaderProps) => (
      <Header {...props} height={headerHeight} left={left} right={right} />
    ),
    [headerHeight, left, right],
  );

  return {
    animation: 'slide_from_right',
    header,
    headerTransparent: true,
  } as NativeStackNavigationOptions;
};

export const Header = memo(
  ({
    back,
    navigation,
    height,
    left,
    right,
    options,
  }: NativeStackHeaderProps & {
    height: number;
    left: number;
    right: number;
  }) => {
    return (
      <XStack
        alignItems="center"
        justifyContent="space-between"
        gap="$5"
        position="relative"
        paddingTop={height - headerHeight}
        paddingLeft={left + 10}
        paddingRight={right + 10}
        height={height}
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
                  size={24}
                  type="Ionicons"
                  name="chevron-back-outline"
                  color="$buttonTextColor1"
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
