import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { ReactElement, useMemo } from 'react';
import { HeaderOptions } from '@react-navigation/elements';
import { useTheme, View, XStack } from 'tamagui';
import { useScreenHeaderOptions } from './header';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { NavigationBackground } from './background';
import Animated, {
  Easing,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { defaultPageVerticalPadding } from '../view/page-view';
import { router, usePathname } from 'expo-router';

export const CustomTabBar = ({
  hidden,
  insets,
  DynamicButton,
  descriptors,
}: BottomTabBarProps & {
  hidden?: boolean;
  DynamicButton?: ReactElement;
}) => {
  const pathname = usePathname();
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: withDelay(
            hidden ? 200 : 0,
            withTiming(hidden ? 250 : 0, {
              duration: 250,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
        },
      ],
    }),
    [hidden],
  );

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          left: insets.left,
          right: insets.right,
          bottom:
            insets.bottom + (insets.bottom ? 0 : defaultPageVerticalPadding),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 10,
        },
      ]}
    >
      <XStack
        position="relative"
        justifyContent="center"
        alignItems="center"
        borderRadius={100}
        paddingHorizontal="$2"
        boxShadow="0 0 10px rgba(0, 0, 0, 0.05)"
        overflow="hidden"
      >
        <NavigationBackground />

        {Object.values(descriptors).map((descriptor) => {
          const path = `/${descriptor.route.name}`;
          const focused = pathname === path;

          return (
            <View
              key={descriptor.route.key}
              height={55}
              width={55}
              cursor="pointer"
              justifyContent="center"
              alignItems="center"
              pressStyle={{ opacity: 0.8 }}
              onPress={() => {
                emitHaptic();
                router.navigate(path);
              }}
            >
              {descriptor.options.tabBarIcon?.({
                focused,
                size: 22,
                color: focused
                  ? theme.tabBarActiveTintColor?.val
                  : theme.tabBarInactiveTintColor?.val,
              })}
            </View>
          );
        })}
      </XStack>

      {DynamicButton}
    </Animated.View>
  );
};

export const useTabsScreenOptions = () => {
  const headerOptions = useScreenHeaderOptions();

  return useMemo(
    () =>
      ({
        ...headerOptions,
        animation: Platform.OS === 'web' ? 'fade' : 'shift',
      }) as HeaderOptions &
        BottomTabNavigationOptions &
        Omit<NativeStackNavigationOptions, 'animation'>,
    [headerOptions],
  );
};
