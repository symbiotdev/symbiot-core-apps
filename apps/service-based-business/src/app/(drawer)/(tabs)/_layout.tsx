import { router, Tabs } from 'expo-router';
import {
  AttentionView,
  Icon,
  useTabsScreenOptions,
} from '@symbiot-core-apps/ui';
import { useMe } from '@symbiot-core-apps/state';
import { PlusActionModal } from '../../../components/tabs/plus-action-modal';
import { Icons } from '../../../icons/config';

const Notifications = () => {
  const { me } = useMe();

  return (
    <AttentionView
      attention={!!me?.stats?.notifications?.new}
      cursor="pointer"
      onPress={() => router.navigate('/notifications')}
    >
      <Icon name={Icons.Notifications} color="$buttonTextColor1" size={24} />
    </AttentionView>
  );
};

export default () => {
  const screenOptions = useTabsScreenOptions();
  const { me } = useMe();
  const hasBusiness = false;

  return (
    <>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Protected guard={!hasBusiness}>
          <Tabs.Screen
            name="actions/index"
            options={{
              headerRight: Notifications,
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

        <Tabs.Protected guard={hasBusiness}>
          <Tabs.Screen
            name="home/index"
            options={{
              headerRight: Notifications,
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
                  name={Icons.Workspaces}
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
