import { Tabs, useSegments } from 'expo-router';
import {
  AttentionView,
  Button,
  CustomTabBar,
  defaultIconSize,
  Icon,
  useDrawer,
  useTabsScreenOptions,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccountState,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import React, { useEffect } from 'react';
import { useCountNewNotificationsReq } from '@symbiot-core-apps/api';
import { useApp } from '@symbiot-core-apps/app';
import { PlusActionAdaptiveModal } from '../../../components/tabs/plus-action-adaptive-modal';

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { stats, setMeStats } = useCurrentAccountState();
  const { icons } = useApp();
  const segments = useSegments();
  const { visible: drawerVisible } = useDrawer();
  const { data: countNewNotifications } = useCountNewNotificationsReq();
  const screenOptions = useTabsScreenOptions();

  useEffect(() => {
    if (countNewNotifications) {
      setMeStats({
        newNotifications: countNewNotifications.count,
      });
    }
  }, [countNewNotifications, setMeStats]);

  return (
    <Tabs
      screenOptions={{
        ...screenOptions,
        ...(drawerVisible && {
          animation: 'none',
        }),
      }}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          hidden={drawerVisible || segments.includes('(stack)')}
          DynamicButton={
            <PlusActionAdaptiveModal
              trigger={
                <Button
                  label="+"
                  fontSize={24}
                  boxShadow="0 0 10px rgba(0, 0, 0, 0.05)"
                  paddingVertical={0}
                  paddingHorizontal={0}
                  borderRadius={50}
                  width={45}
                  height={45}
                />
              }
            />
          }
        />
      )}
    >
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

      <Tabs.Protected guard={!!currentBrand}>
        <Tabs.Screen
          name="schedule"
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
      </Tabs.Protected>

      <Tabs.Screen
        name="menu"
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
