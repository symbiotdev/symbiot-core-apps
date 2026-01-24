import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { ApiProvider, useAuthTokens } from '@symbiot-core-apps/api';
import { Toaster } from 'burnt/web';
import { unlockAsync } from 'expo-screen-orientation';
import { Platform } from 'react-native';
import { useFixelFont } from '@symbiot-core-apps/theme';
import { preventAutoHideAsync, setOptions } from 'expo-splash-screen';
import { AppProvider } from '@symbiot-core-apps/app';
import { I18nProvider } from '@symbiot-core-apps/shared';
import { appSettings } from '../../settings';

void preventAutoHideAsync();
setOptions({
  fade: true,
  duration: 300,
});

if (Platform.OS !== 'web') {
  void unlockAsync();
}

export default () => {
  const [fontsLoaded] = useFixelFont();
  const { removeTokens, tokens } = useAuthTokens();
  const onNoRespond = useCallback(() => {
    alert('noRespond');
  }, []);

  if (!fontsLoaded || !tokens) return null;

  return (
    <I18nProvider
      defaultLanguage={appSettings.language.default}
      appTranslations={appSettings.language.translations}
    >
      <ApiProvider onNoRespond={onNoRespond} onUnauthorized={removeTokens}>
        <AppProvider defaultSettings={appSettings}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Protected guard={!tokens.access}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
            <Stack.Protected guard={!!tokens.access}>
              <Stack.Screen name="(authed)" />
            </Stack.Protected>
          </Stack>

          <Toaster position="top-right" />
        </AppProvider>
      </ApiProvider>
    </I18nProvider>
  );
};
