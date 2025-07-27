import {
  BottomTabBarButtonProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { GestureResponderEvent, Platform } from 'react-native';
import { useCallback, useMemo } from 'react';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { HeaderOptions, PlatformPressable } from '@react-navigation/elements';
import { useTheme } from 'tamagui';
import { Blur } from '../blur/blur';
import { useScreenHeaderOptions } from './header';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const HapticTabBarButton = (props: BottomTabBarButtonProps) => {
  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      void impactAsync(ImpactFeedbackStyle.Light);

      props.onPressIn?.(e);
    },
    [props],
  );

  return (
    <PlatformPressable
      {...props}
      android_ripple={{ color: 'transparent' }}
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
        tabBarBackground: () => <Blur style={{ flex: 1 }} />,
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
