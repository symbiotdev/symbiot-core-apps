import { Redirect, Stack } from 'expo-router';
import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import { NotificationsProvider } from '@symbiot-core-apps/notification';
import { StateProvider, useMeLoader } from '@symbiot-core-apps/state';
import { useAuthTokens } from '@symbiot-core-apps/api';
import { useT } from '@symbiot-core-apps/i18n';

export default () => {
  const { t } = useT();
  const { me } = useMeLoader();
  const { tokens } = useAuthTokens();
  const headerScreenOptions = useStackScreenHeaderOptions();

  if (!tokens.access) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <StateProvider>
      <NotificationsProvider
        soundSource={require('../../../assets/audio/new-notification-sound.wav')}
        onPressNotification={() => alert('push notification pressed')}
      >
        <Stack screenOptions={headerScreenOptions}>
          <Stack.Protected guard={!!me}>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
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
          </Stack.Protected>

          <Stack.Protected guard={!me}>
            <Stack.Screen name="verifying/index" />
          </Stack.Protected>
        </Stack>
      </NotificationsProvider>
    </StateProvider>
  );
};
