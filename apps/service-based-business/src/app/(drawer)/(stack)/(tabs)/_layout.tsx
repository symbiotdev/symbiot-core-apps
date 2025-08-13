import { router, Tabs } from 'expo-router';
import {
  AttentionView,
  H3,
  HeaderButton,
  headerButtonSize,
  Icon,
  useDrawer,
  useTabsScreenOptions,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useT } from '@symbiot-core-apps/i18n';
import { PlusActionModal } from '../../../../components/tabs/plus-action-modal';
import { Icons } from '../../../../icons/config';
import { ViewStyle } from 'react-native';

const HelloHeaderLeft = () => {
  const { t } = useT();
  const { me } = useCurrentAccount();

  return me && me.firstname !== 'Account' ? (
    <H3 lineHeight={headerButtonSize} numberOfLines={1}>
      {t('greeting_firstname', {
        firstname: me.firstname,
      })}
    </H3>
  ) : undefined;
};

const NotificationsHeaderButton = () => {
  const { stats } = useCurrentAccount();

  return (
    <HeaderButton
      attention={!!stats.newNotifications}
      iconName={Icons.Notifications}
      onPress={() => router.navigate('/notifications')}
    />
  );
};

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { stats } = useCurrentAccount();
  const { visible: drawerVisible } = useDrawer();
  const screenOptions = useTabsScreenOptions();

  return (
    <Tabs
      screenOptions={{
        ...screenOptions,
        animation: drawerVisible ? 'none' : screenOptions.animation,
        tabBarStyle: {
          ...(screenOptions.tabBarStyle as ViewStyle),
          display: drawerVisible ? 'none' : undefined,
        },
      }}
    >
      <Tabs.Protected guard={!currentBrand}>
        <Tabs.Screen
          name="actions/index"
          options={{
            headerLeft: !drawerVisible ? HelloHeaderLeft : undefined,
            headerRight: !drawerVisible ? NotificationsHeaderButton : undefined,
            tabBarIcon: ({ color, size, focused }) => (
              <AttentionView attention={!!stats.newNotifications}>
                <Icon
                  name={Icons.Workspace}
                  color={color}
                  size={size}
                  type={focused ? 'SolarBold' : undefined}
                />
              </AttentionView>
            ),
          }}
        />
      </Tabs.Protected>

      <Tabs.Protected guard={!!currentBrand}>
        <Tabs.Screen
          name="home/index"
          options={{
            headerLeft: !drawerVisible ? HelloHeaderLeft : undefined,
            headerRight: !drawerVisible ? NotificationsHeaderButton : undefined,
            tabBarIcon: ({ color, size, focused }) => (
              <AttentionView attention={!!stats.newNotifications}>
                <Icon
                  name={Icons.Home}
                  color={color}
                  size={size}
                  type={focused ? 'SolarBold' : undefined}
                />
              </AttentionView>
            ),
          }}
        />
        <Tabs.Screen
          name="calendar/index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={Icons.Calendar}
                color={color}
                size={size}
                type={focused ? 'SolarBold' : undefined}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="plus/index"
          options={{
            tabBarButton: PlusActionModal,
          }}
        />
        <Tabs.Screen
          name="brands/index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={Icons.Workspace}
                color={color}
                size={size}
                type={focused ? 'SolarBold' : undefined}
              />
            ),
          }}
        />
      </Tabs.Protected>

      <Tabs.Screen
        name="preferences/index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={Icons.Preferences}
              color={color}
              size={size}
              type={focused ? 'SolarBold' : undefined}
            />
          ),
        }}
      />
    </Tabs>
  );
};
