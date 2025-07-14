import { Slot } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ApiProvider } from '@symbiot-core-apps/api';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useDevId } from '@symbiot-core-apps/shared';
import { Toaster } from 'burnt/web';
import { unlockAsync } from 'expo-screen-orientation';
import { Platform } from 'react-native';
import { ThemeProvider, useFixelFont } from '@symbiot-core-apps/theme';
import {
  hideAsync,
  preventAutoHideAsync,
  setOptions,
} from 'expo-splash-screen';
import { ErrorView } from '@symbiot-core-apps/ui';

void preventAutoHideAsync();
setOptions({
  fade: true,
  duration: 300,
});

if (Platform.OS !== 'web') {
  void unlockAsync();
}

export default () => {
  const devId = useDevId();
  const [fontsLoaded, fontsError] = useFixelFont();
  const { i18n } = useTranslation();

  // const { token } = useAuthState();
  // const { clear } = useStoreClear();
  const onNoRespond = useCallback(() => {
    alert('noRespond');
  }, []);

  const onUnauthorized = useCallback(() => {
    alert('onUnauthorized');
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      void hideAsync();
    }
  }, [fontsLoaded]);

  if (fontsError) {
    return <ErrorView message="Fonts could not be loaded." />;
  }

  return (
    fontsLoaded &&
    devId && (
      <KeyboardProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <ApiProvider
              devId={devId}
              authToken={undefined}
              languageCode={i18n.language}
              onNoRespond={onNoRespond}
              onUnauthorized={onUnauthorized}
            >
              <Slot />

              <Toaster position="top-right" />
            </ApiProvider>
          </ThemeProvider>
        </I18nextProvider>
      </KeyboardProvider>
    )
  );
};
