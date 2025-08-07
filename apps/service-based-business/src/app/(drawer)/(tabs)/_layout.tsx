import { router, Tabs } from 'expo-router';
import {
  AttentionView,
  H3,
  HeaderButton,
  headerButtonSize,
  Icon,
  useTabsScreenOptions,
} from '@symbiot-core-apps/ui';
import { useMe } from '@symbiot-core-apps/state';
import { PlusActionModal } from '../../../components/tabs/plus-action-modal';
import { Icons } from '../../../icons/config';
import { useT } from '@symbiot-core-apps/i18n';

const HelloHeaderLeft = () => {
  const { t } = useT();
  const { me } = useMe();

  return me && me.firstname !== 'Account' ? (
    <H3 lineHeight={headerButtonSize} numberOfLines={1}>
      {t('greeting_firstname', {
        firstname: me.firstname,
      })}
    </H3>
  ) : undefined;
};

const NotificationsHeaderButton = () => {
  const { me } = useMe();

  return (
    <HeaderButton
      attention={!!me?.stats?.notifications?.new}
      iconName={Icons.Notifications}
      onPress={() => router.navigate('/notifications')}
    />
  );
};

export default () => {
  const screenOptions = useTabsScreenOptions();
  const { me } = useMe();
  const hasBrand = false;

  return (
    <>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Protected guard={!hasBrand}>
          <Tabs.Screen
            name="actions/index"
            options={{
              headerLeft: HelloHeaderLeft,
              headerRight: NotificationsHeaderButton,
              tabBarIcon: ({ color, size, focused }) => (
                <AttentionView attention={!!me?.stats?.notifications?.new}>
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
        </Tabs.Protected>

        <Tabs.Protected guard={hasBrand}>
          <Tabs.Screen
            name="home/index"
            options={{
              headerLeft: HelloHeaderLeft,
              headerRight: NotificationsHeaderButton,
              tabBarIcon: ({ color, size, focused }) => (
                <AttentionView attention={!!me?.stats?.notifications?.new}>
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
            name="workspaces/index"
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
          name="menu/index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={Icons.Menu}
                color={color}
                size={size}
                type={focused ? 'SolarBold' : undefined}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};
