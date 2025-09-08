import { router, Tabs, useSegments } from 'expo-router';
import {
  AnimatedTabBar,
  AttentionView,
  defaultIconSize,
  H3,
  HeaderButton,
  headerButtonSize,
  Icon,
  LightText,
  RegularText,
  useDrawer,
  useTabsScreenOptions,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccount,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import React, { useEffect } from 'react';
import { useAccountAuthSignOutQuery, useCountNewNotifications } from '@symbiot-core-apps/api';
import { View, XStack } from 'tamagui';
import { useApp } from '@symbiot-core-apps/app';
import { PlusActionAdaptiveModal } from '../../../components/tabs/plus-action-adaptive-modal';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { ConfirmAlert, DeviceVersion } from '@symbiot-core-apps/shared';

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { icons } = useApp();
  const { t } = useTranslation();
  const segments = useSegments();
  const { visible: drawerVisible } = useDrawer();
  const { me, stats, setMeStats } = useCurrentAccount();
  const { mutate: signOut } = useAccountAuthSignOutQuery();
  const { data: countNewNotifications } = useCountNewNotifications();
  const { hasAnyOfPermissions, hasAnyPermission } = useCurrentBrandEmployee();
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
      tabBar={(props) =>
        !drawerVisible && (
          <AnimatedTabBar {...props} hidden={segments.includes('(stack)')} />
        )
      }
    >
      <Tabs.Screen
        name="home"
        options={{
          headerLeft: () =>
            me && (
              <H3 lineHeight={headerButtonSize} numberOfLines={1}>
                {t('shared.greeting_firstname', {
                  firstname: me.firstname,
                })}
              </H3>
            ),
          headerRight: () => (
            <HeaderButton
              attention={!!stats.newNotifications}
              iconName={icons.Notifications}
              onPress={() => router.push('/notifications')}
            />
          ),
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
          name="my-brand"
          options={{
            headerLeft: () =>
              currentBrand && (
                <H3 lineHeight={headerButtonSize} numberOfLines={1}>
                  {currentBrand.name}
                </H3>
              ),
            headerRight: () =>
              hasAnyPermission() && (
                <HeaderButton
                  iconName="SettingsMinimalistic"
                  onPress={() => router.push('/brand/menu')}
                />
              ),
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
        name="menu"
        options={{
          headerLeft: () =>
            Platform.OS !== 'web' && (
              <XStack gap="$2" alignItems="center">
                <Icon name="Code" color="$placeholderColor" />
                <RegularText color="$placeholderColor">
                  {t('shared.version')}: {DeviceVersion}
                </RegularText>
              </XStack>
            ),
          headerRight: () => (
            <HeaderButton
              iconName="Logout2"
              onPress={() =>
                ConfirmAlert({
                  title: t('shared.auth.sign_out.confirm.title'),
                  callback: signOut,
                })
              }
            />
          ),
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
