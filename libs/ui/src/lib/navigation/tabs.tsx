import {
  BottomTabBarButtonProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { GestureResponderEvent, Platform } from 'react-native';
import { useCallback, useMemo } from 'react';
import { HeaderOptions, PlatformPressable } from '@react-navigation/elements';
import { useTheme } from 'tamagui';
import { Blur } from '../blur/blur';
import { useScreenHeaderOptions } from './header';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { emitHaptic } from '@symbiot-core-apps/shared';

export const HapticTabBarButton = (props: BottomTabBarButtonProps) => {
  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      emitHaptic();

      props.onPressIn?.(e);
    },
    [props],
  );

  return (
    <PlatformPressable
      {...props}
      android_ripple={{ color: null }}
      onPressIn={onPressIn}
    />
  );
};

export const useTabsScreenOptions = () => {
  const theme = useTheme();
  const headerOptions = useScreenHeaderOptions();

  return useMemo(
    () =>
      ({
        ...headerOptions,
        title: '',
        animation: 'shift',
        tabBarStyle: {
          borderTopWidth: 0,
          ...(Platform.OS !== 'android' && {
            position: 'absolute',
            backgroundColor: 'transparent',
          }),
        },
        tabBarActiveTintColor: theme.tabBarActiveTintColor?.val,
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor?.val,
        tabBarButton: HapticTabBarButton,
        tabBarBackground:
          Platform.OS !== 'android'
            ? () => <Blur style={{ flex: 1 }} />
            : undefined,
      }) as HeaderOptions &
        BottomTabNavigationOptions &
        Omit<NativeStackNavigationOptions, 'animation'>,
    [
      headerOptions,
      theme.tabBarActiveTintColor?.val,
      theme.tabBarInactiveTintColor?.val,
    ],
  );
};
