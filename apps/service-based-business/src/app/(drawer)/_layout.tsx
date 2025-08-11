import { Redirect, Stack } from 'expo-router';
import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import { NotificationsProvider } from '@symbiot-core-apps/notification';
import {
  StateProvider,
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import {
  useAccountMeQuery,
  useAuthTokens,
  useCurrentBrandQuery,
} from '@symbiot-core-apps/api';
import { useT } from '@symbiot-core-apps/i18n';
import { onPressNotification } from '../../utils/notification';
import { useEffect, useMemo } from 'react';

export default () => {
  const { t } = useT();
  const headerScreenOptions = useStackScreenHeaderOptions();
  const { me, updateMe, updateMePreferences } = useCurrentAccount();
  const { tokens, setTokens } = useAuthTokens();
  const {
    brand: currentBrand,
    brands: currentBrands,
    setBrand: setCurrentBrand,
    setBrands: setCurrentBrands,
  } = useCurrentBrandState();
  const { data: meResponse } = useAccountMeQuery({
    enabled: !!tokens.access,
  });
  const { data: currentBrandResponse } = useCurrentBrandQuery({
    enabled: !!tokens.access,
  });

  const loaded = useMemo(
    () => !!me && !!(currentBrand || currentBrands),
    [me, currentBrand, currentBrands],
  );

  useEffect(() => {
    if (meResponse) {
      updateMe(meResponse);

      if (meResponse.preferences) {
        void updateMePreferences(meResponse.preferences);
      }
    }
  }, [meResponse, updateMe, updateMePreferences]);

  useEffect(() => {
    if (currentBrandResponse) {
      setCurrentBrand(currentBrandResponse.brand);

      if (currentBrandResponse.brands) {
        setCurrentBrands(currentBrandResponse.brands);
      }

      if (currentBrandResponse.tokens) {
        setTokens(currentBrandResponse.tokens);
      }
    }
  }, [currentBrandResponse, setCurrentBrand, setCurrentBrands, setTokens]);

  if (!tokens.access) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <StateProvider>
      <NotificationsProvider
        soundSource={require('../../../assets/audio/new_notification_sound.wav')}
        onPressNotification={onPressNotification}
      >
        <Stack screenOptions={headerScreenOptions}>
          <Stack.Protected guard={!loaded}>
            <Stack.Screen name="verifying/index" />
          </Stack.Protected>

          <Stack.Protected guard={loaded}>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="brand/create"
              options={{
                gestureEnabled: false,
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
        </Stack>
      </NotificationsProvider>
    </StateProvider>
  );
};
