import { Tabs, useSegments } from 'expo-router';
import { LightText } from '@symbiot-core-apps/ui';
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
import {
  AttentionView,
  DEFAULT_ICON_SIZE,
  GlassView,
  Icon,
  useSideMenu,
  useStackNavigationOptions,
} from '@symbiot-core-apps/ui2';

export default () => {
  const { stats } = useCurrentAccountState();
  const { brand: currentBrand } = useCurrentBrandState();
  const { icons } = useAppSettings();
  const segments = useSegments();
  const { visible: sideMenuVisible } = useSideMenu();
  const stackNavigationOptions = useStackNavigationOptions();
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
      screenOptions={
        {
          ...stackNavigationOptions,
          animation: 'none',
        } as BottomTabNavigationOptions
      }
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          hidden={sideMenuVisible || segments.includes('(stack)')}
          DynamicButton={
            <PlusActionAdaptiveModal
              trigger={
                <GlassView
                  interactive
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <LightText fontSize={30}>+</LightText>
                </GlassView>
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
            <AttentionView active={!!stats.newNotifications}>
              <Icon
                name={icons.Home}
                color={color}
                size={Math.min(size, DEFAULT_ICON_SIZE)}
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
                size={Math.min(size, DEFAULT_ICON_SIZE)}
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
              size={Math.min(size, DEFAULT_ICON_SIZE)}
              type={focused ? 'SolarBold' : undefined}
            />
          ),
        }}
      />
    </Tabs>
  );
};
