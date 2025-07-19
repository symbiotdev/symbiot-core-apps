import {
  BottomTabBarButtonProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { GestureResponderEvent } from 'react-native';
import { useCallback, useMemo } from 'react';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { HeaderOptions, PlatformPressable } from '@react-navigation/elements';
import { useTheme } from 'tamagui';

export const HapticTabBarButton = (props: BottomTabBarButtonProps) => {
  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      void impactAsync(ImpactFeedbackStyle.Light);

      props.onPressIn?.(e);
    },
    [props],
  );

  return <PlatformPressable {...props} onPressIn={onPressIn} />;
};

export const defaultTabsScreenOptions: BottomTabNavigationOptions = {
  tabBarStyle: { borderTopWidth: 0 },
  tabBarButton: HapticTabBarButton,
};

export const defaultTabsScreenCommonOptions: BottomTabNavigationOptions &
  HeaderOptions = {
  title: '',
  headerShadowVisible: false,
  animation: 'shift',
};

export const useTabsScreenOptions = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      tabBarButton: HapticTabBarButton,
      tabBarStyle: { borderTopWidth: 0 },
      tabBarActiveTintColor: theme.tabBarActiveTintColor?.val,
      tabBarInactiveTintColor: theme.tabBarInactiveTintColor?.val,
    }),
    [theme.tabBarActiveTintColor?.val, theme.tabBarInactiveTintColor?.val],
  );
};
