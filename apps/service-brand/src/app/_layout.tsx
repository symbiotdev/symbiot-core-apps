import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { ApiProvider, useAuthTokens } from '@symbiot-core-apps/api';
import { Toaster } from 'burnt/web';
import { unlockAsync } from 'expo-screen-orientation';
import { Platform } from 'react-native';
import { useFixelFont } from '@symbiot-core-apps/theme';
import { preventAutoHideAsync, setOptions } from 'expo-splash-screen';
import {
  AppProvider,
  useAppSettings,
  useAppVersionUpdateType,
} from '@symbiot-core-apps/app';
import { I18nProvider } from '@symbiot-core-apps/shared';
import { appSettings } from '../../settings';
import MandatoryUpdate from '../components/update/mandatory-update';

void preventAutoHideAsync();
setOptions({ fade: true, duration: 200 });

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
          <App authed={!!tokens.access} />
          <Toaster position="top-right" />
        </AppProvider>
      </ApiProvider>
    </I18nProvider>
  );
};

const App = ({ authed }: { authed: boolean }) => {
  const { functionality } = useAppSettings();
  const { updateType: appUpdateType } = useAppVersionUpdateType();

  if (
    functionality.available.mandatoryUpdate &&
    appUpdateType === 'mandatory'
  ) {
    return <MandatoryUpdate />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!authed}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={authed}>
        <Stack.Screen name="(authed)" />
      </Stack.Protected>
    </Stack>
  );
};
