import { Tabs, useSegments } from 'expo-router';
import {
  AttentionView,
  Button,
  defaultIconSize,
  Icon,
  useDrawer,
  useScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccountState,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import React, { useEffect } from 'react';
import { useAppSettings } from '@symbiot-core-apps/app';
import { PlusActionAdaptiveModal } from '../../../components/tabs/plus-action-adaptive-modal';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useCountNewNotificationsReq } from '@symbiot-core-apps/api';
import { CustomTabBar } from '../../../components/tabs/tab-bar';

export default () => {
  const { stats } = useCurrentAccountState();
  const { brand: currentBrand } = useCurrentBrandState();
  const { icons } = useAppSettings();
  const segments = useSegments();
  const { visible: drawerVisible } = useDrawer();
  const headerOptions = useScreenHeaderOptions();
  const { setMyStats } = useCurrentAccountState();
  const { data: countNewNotifications } = useCountNewNotificationsReq();

  useEffect(() => {
    if (countNewNotifications) {
      setMyStats({
        newNotifications: countNewNotifications.count,
      });
    }
  }, [countNewNotifications, setMyStats]);

  return (
    <Tabs
      screenOptions={headerOptions as BottomTabNavigationOptions}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          hidden={drawerVisible || segments.includes('(stack)')}
          DynamicButton={
            <PlusActionAdaptiveModal
              ignoreHapticOnOpen
              trigger={
                <Button
                  label="+"
                  fontSize={30}
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
