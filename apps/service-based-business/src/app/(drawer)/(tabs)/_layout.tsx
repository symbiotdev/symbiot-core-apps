import { Tabs, useSegments } from 'expo-router';
import {
  AnimatedTabBar,
  AttentionView,
  defaultIconSize,
  Icon,
  LightText,
  useDrawer,
  useTabsScreenOptions,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import React, { useEffect } from 'react';
import { useCountNewNotifications } from '@symbiot-core-apps/api';
import { PlusActionAdaptiveModal } from '../../../components/tabs/plus-action-adaptive-modal';
import { View } from 'tamagui';
import { useApp } from '@symbiot-core-apps/app';

export default () => {
  const { icons } = useApp();
  const { brand: currentBrand } = useCurrentBrandState();
  const segments = useSegments();
  const { stats, setMeStats } = useCurrentAccount();
  const { visible: drawerVisible } = useDrawer();
  const screenOptions = useTabsScreenOptions();
  const { data: countNewNotifications } = useCountNewNotifications();

  useEffect(() => {
    if (countNewNotifications) {
      setMeStats({
        newNotifications: countNewNotifications.count,
      });
    }
  }, [countNewNotifications]);

  return (
    <Tabs
      screenOptions={{
        ...screenOptions,
        headerShown: false,
        animation: drawerVisible ? 'none' : screenOptions.animation,
      }}
      tabBar={(props) =>
        !drawerVisible && (
          <AnimatedTabBar {...props} hidden={segments.includes('(stack)')} />
        )
      }
    >
      <Tabs.Protected guard={!!currentBrand}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <AttentionView attention={!!stats.newNotifications}>
                <Icon
                  name={icons.Home}
                  color={color}
                  size={Math.min(size, defaultIconSize)}
                  type={focused ? 'SolarBold' : undefined}
                />
              </AttentionView>
            ),
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={icons.Calendar}
                color={color}
                size={Math.min(size, defaultIconSize)}
                type={focused ? 'SolarBold' : undefined}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="plus"
          options={{
            tabBarButton: PlusActionAdaptiveModal,
            tabBarIcon: ({ color, size }) => (
              <View
                height={size + 18}
                width={50}
                backgroundColor="$highlighted"
                justifyContent="center"
                alignItems="center"
                borderRadius="$8"
              >
                <LightText
                  color={color}
                  fontSize={size * 1.4}
                  lineHeight={size * 1.4}
                >
                  +
                </LightText>
              </View>
            ),
          }}
        />
      </Tabs.Protected>

      <Tabs.Screen
        name="brand"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AttentionView
              attention={!currentBrand && !!stats.newNotifications}
            >
              <Icon
                name={icons.Workspace}
                color={color}
                size={size}
                type={focused ? 'SolarBold' : undefined}
              />
            </AttentionView>
          ),
        }}
      />

      <Tabs.Screen
        name="app"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={icons.More}
              color={color}
              size={Math.min(size, defaultIconSize)}
              type={focused ? 'SolarBold' : undefined}
            />
          ),
        }}
      />
    </Tabs>
  );
};
