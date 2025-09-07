import {
  BottomTabBar,
  BottomTabBarButtonProps,
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { GestureResponderEvent, Platform } from 'react-native';
import { useCallback, useMemo } from 'react';
import { HeaderOptions, PlatformPressable } from '@react-navigation/elements';
import { useTheme } from 'tamagui';
import { useScreenHeaderOptions } from './header';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { NavigationBackground } from './background';
import Animated, {
  Easing,
  useAnimatedStyle,
  withDelay,
  withTiming
} from 'react-native-reanimated';

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
      style={{ paddingTop: 10, alignItems: 'center' }}
      android_ripple={{ color: null }}
      onPressIn={onPressIn}
    />
  );
};

export const AnimatedTabBar = ({
  hidden,
  ...tabBarProps
}: BottomTabBarProps & {
  hidden: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: withDelay(
            hidden ? 200 : 0,
            withTiming(hidden ? 250 : 0, {
              duration: 250,
              easing: Easing.inOut(Easing.ease)
            }),
          ),
        },
      ],
    }),
    [hidden],
  );

  return (
    <Animated.View style={animatedStyle}>
      <BottomTabBar {...tabBarProps} />
    </Animated.View>
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
        animation: Platform.OS === 'web' ? 'fade' : 'shift',
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
        tabBarBackground: () => (
          <NavigationBackground
            borderTopWidth={1}
            borderTopColor="$background1"
          />
        ),
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
