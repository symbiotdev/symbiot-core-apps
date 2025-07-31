import { router, Tabs } from 'expo-router';
import {
  AttentionView,
  Icon,
  useTabsScreenOptions,
} from '@symbiot-core-apps/ui';
import { useMe } from '@symbiot-core-apps/state';

const Notifications = () => {
  const { me } = useMe();

  return (
    <AttentionView
      attention={!!me?.stats?.notifications?.new}
      cursor="pointer"
      onPress={() => router.navigate('/notifications')}
    >
      <Icon name="Bell" color="$buttonTextColor1" size={24} />
    </AttentionView>
  );
};

export default () => {
  const screenOptions = useTabsScreenOptions();
  const { me } = useMe();
  const hasBusiness = true;

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Protected guard={!hasBusiness}>
        <Tabs.Screen
          name="actions/index"
          options={{
            headerRight: Notifications,
            tabBarIcon: ({ color, size, focused }) => (
              <AttentionView attention={!!me?.stats?.notifications?.new}>
                <Icon
                  name="Home"
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
                  name="Home"
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
                name="Calendar"
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
            href: null,
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name="Heart"
                color={color}
                size={size}
                type={focused ? 'SolarBold' : undefined}
              />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              console.log(123);
            },
          }}
        />
        <Tabs.Screen
          name="workspaces/index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name="Heart"
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
              name="Widget"
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
