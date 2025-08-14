import { Slot } from 'expo-router';
import { useCallback } from 'react';
import { ApiProvider, useAuthTokens } from '@symbiot-core-apps/api';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Toaster } from 'burnt/web';
import { unlockAsync } from 'expo-screen-orientation';
import { Platform } from 'react-native';
import { ThemeProvider, useFixelFont } from '@symbiot-core-apps/theme';
import { preventAutoHideAsync, setOptions } from 'expo-splash-screen';
import { darkTheme, lightTheme } from '../theme/config';
import { I18nProvider } from '@symbiot-core-apps/i18n';

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
  const { removeTokens } = useAuthTokens();
  const onNoRespond = useCallback(() => {
    alert('noRespond');
  }, []);

  return (
    fontsLoaded && (
      <ApiProvider onNoRespond={onNoRespond} onUnauthorized={removeTokens}>
        <KeyboardProvider>
          <I18nProvider>
            <ThemeProvider darkTheme={darkTheme} lightTheme={lightTheme}>
              <Slot />
              <Toaster position="top-right" />
            </ThemeProvider>
          </I18nProvider>
        </KeyboardProvider>
      </ApiProvider>
    )
  );
};
