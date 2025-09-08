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
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import React, { useEffect } from 'react';
import { useCountNewNotifications } from '@symbiot-core-apps/api';
import { View } from 'tamagui';
import { useApp } from '@symbiot-core-apps/app';
import { PlusActionAdaptiveModal } from '../../../components/tabs/plus-action-adaptive-modal';

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { icons } = useApp();
  const segments = useSegments();
  const { visible: drawerVisible } = useDrawer();
  const { stats, setMeStats } = useCurrentAccount();
  const { hasAnyOfPermissions } = useCurrentBrandEmployee();
  const { data: countNewNotifications } = useCountNewNotifications();
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
        headerShown: false,
        ...(drawerVisible && {
          animation: 'none',
        }),
      }}
      tabBar={(props) =>
        !drawerVisible && (
          <AnimatedTabBar {...props} hidden={segments.includes('(stack)')} />
        )
      }
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
        <Tabs.Protected
          guard={hasAnyOfPermissions([
            'locationsAll',
            'employeesAll',
            'clientsAll',
            'servicesAll',
          ])}
        >
          <Tabs.Screen
            name="plus/index"
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
          name="my-brand"
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
      </Tabs.Protected>

      <Tabs.Screen
        name="preferences"
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
