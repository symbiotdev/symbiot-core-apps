import {
  BottomTabBarButtonProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { GestureResponderEvent } from 'react-native';
import { useCallback, useMemo } from 'react';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { HeaderOptions, PlatformPressable } from '@react-navigation/elements';
import { useTheme } from 'tamagui';
import { BlurView } from 'expo-blur';
import { useSystemScheme } from '@symbiot-core-apps/shared';

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

export const defaultTabsScreenCommonOptions: BottomTabNavigationOptions &
  HeaderOptions = {
  title: '',
  headerShown: false,
  animation: 'shift',
};

export const useTabsScreenOptions = () => {
  const theme = useTheme();
  const scheme = useSystemScheme();

  return useMemo(
    () =>
      ({
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          position: 'absolute',
        },
        tabBarActiveTintColor: theme.tabBarActiveTintColor?.val,
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor?.val,
        tabBarButton: HapticTabBarButton,
        tabBarBackground: () => (
          <BlurView intensity={30} tint={scheme} style={{ flex: 1 }} />
        ),
      }) as BottomTabNavigationOptions,
    [
      scheme,
      theme.tabBarActiveTintColor?.val,
      theme.tabBarInactiveTintColor?.val,
    ],
  );
};
