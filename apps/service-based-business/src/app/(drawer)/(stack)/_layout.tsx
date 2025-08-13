import { Stack } from 'expo-router';
import { useDrawer, useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useT } from '@symbiot-core-apps/i18n';
import { useEffect, useMemo } from 'react';
import { hideAsync } from 'expo-splash-screen';
import { useCountNewNotifications } from '@symbiot-core-apps/api';

export default () => {
  const { t } = useT();
  const screenOptions = useStackScreenHeaderOptions();
  const { visible: drawerVisible } = useDrawer();
  const { brands: currentBrands } = useCurrentBrandState();
  const { setMeStats } = useCurrentAccount();
  const { data: countNewNotifications } = useCountNewNotifications();

  const nestedScreenAnimation = useMemo(
    () => (drawerVisible ? 'none' : screenOptions.animation),
    [drawerVisible],
  );

  useEffect(() => {
    void hideAsync();
  }, []);

  useEffect(() => {
    if (countNewNotifications) {
      setMeStats({
        newNotifications: countNewNotifications.count,
      });
    }
  }, [countNewNotifications]);

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="(tabs)"
        options={{ animation: nestedScreenAnimation }}
      />

      <Stack.Protected guard={!!currentBrands && !currentBrands.length}>
        <Stack.Screen
          name="brand/create"
          options={{
            gestureEnabled: false,
            animation: nestedScreenAnimation,
          }}
        />
      </Stack.Protected>

      <Stack.Screen
        name="follow-us/index"
        options={{
          headerTitle: t('follow_us'),
        }}
      />
      <Stack.Screen
        name="help-feedback/index"
        options={{
          headerTitle: t('faq.title'),
        }}
      />
      <Stack.Screen
        name="notifications/index"
        options={{
          headerTitle: t('notifications.title'),
          animation: nestedScreenAnimation,
        }}
      />
      <Stack.Screen
        name="preferences/account/index"
        options={{
          headerTitle: t('profile'),
        }}
      />
      <Stack.Screen name="preferences/account/remove" />
      <Stack.Screen
        name="preferences/appearance/index"
        options={{
          headerTitle: t('preferences.appearance.title'),
        }}
      />
      <Stack.Screen
        name="preferences/calendar/index"
        options={{
          headerTitle: t('preferences.calendar.title'),
        }}
      />
      <Stack.Screen
        name="preferences/language/index"
        options={{
          headerTitle: t('preferences.language.title'),
        }}
      />
      <Stack.Screen
        name="preferences/notifications/index"
        options={{
          headerTitle: t('preferences.notifications.title'),
        }}
      />
      <Stack.Screen
        name="terms-privacy/index"
        options={{
          headerTitle: t('docs.terms_privacy'),
        }}
      />
    </Stack>
  );
};
