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

export const defaultTabsScreenCommonOptions: BottomTabNavigationOptions &
  HeaderOptions = {
  title: '',
  headerShown: false,
  animation: 'shift',
};

export const useTabsScreenOptions = () => {
  const theme = useTheme();

  return useMemo(
    () =>
      ({
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
      }) as BottomTabNavigationOptions,
    [theme.tabBarActiveTintColor?.val, theme.tabBarInactiveTintColor?.val],
  );
};
