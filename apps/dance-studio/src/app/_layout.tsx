import { Slot } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ApiProvider } from '@symbiot-core-apps/api';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { i18n } from '@symbiot-core-apps/i18n';
import { Scheme, useDevId, useSystemScheme } from '@symbiot-core-apps/shared';
import { Toaster } from 'burnt/web';
import { useFonts } from 'expo-font';
import { createFont, createTamagui, TamaguiProvider, useTheme } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import { unlockAsync } from 'expo-screen-orientation';
import { Platform, StatusBar } from 'react-native';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';

if (Platform.OS !== 'web') {
  void unlockAsync();
}

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  fonts: {
    ...defaultConfig.fonts,
    body: createFont({
      ...defaultConfig.fonts.body,
      family: 'BodyRegular',
      face: {
        100: { normal: 'BodyThin', italic: 'BodyThinItalic' },
        200: { normal: 'BodyExtraLight', italic: 'BodyExtraLightItalic' },
        300: { normal: 'BodyLight', italic: 'BodyLightItalic' },
        400: { normal: 'BodyRegular', italic: 'BodyRegularItalic' },
        500: { normal: 'BodyMedium', italic: 'BodyMediumItalic' },
        600: { normal: 'BodySemiBold', italic: 'BodySemiBoldItalic' },
        700: { normal: 'BodyBold', italic: 'BodyBoldItalic' },
        800: { normal: 'BodyExtraBold', italic: 'BodyExtraBoldItalic' },
        900: { normal: 'BodyBlack', italic: 'BodyBlackItalic' },
      },
    }),
  },
});

export default () => {
  const devId = useDevId();
  const scheme = useSystemScheme();

  const [fontsLoaded, fontsError] = useFonts({
    BodyThin: require('../../assets/fonts/FixelText-Thin.otf'),
    BodyThinItalic: require('../../assets/fonts/FixelText-ThinItalic.otf'),
    BodyExtraLight: require('../../assets/fonts/FixelText-ExtraLight.otf'),
    BodyExtraLightItalic: require('../../assets/fonts/FixelText-ExtraLightItalic.otf'),
    BodyLight: require('../../assets/fonts/FixelText-Light.otf'),
    BodyLightItalic: require('../../assets/fonts/FixelText-LightItalic.otf'),
    BodyRegular: require('../../assets/fonts/FixelText-Regular.otf'),
    BodyRegularItalic: require('../../assets/fonts/FixelText-RegularItalic.otf'),
    BodyMedium: require('../../assets/fonts/FixelText-Medium.otf'),
    BodyMediumItalic: require('../../assets/fonts/FixelText-MediumItalic.otf'),
    BodySemiBold: require('../../assets/fonts/FixelText-SemiBold.otf'),
    BodySemiBoldItalic: require('../../assets/fonts/FixelText-SemiBoldItalic.otf'),
    BodyBold: require('../../assets/fonts/FixelText-Bold.otf'),
    BodyBoldItalic: require('../../assets/fonts/FixelText-BoldItalic.otf'),
    BodyExtraBold: require('../../assets/fonts/FixelText-ExtraBold.otf'),
    BodyExtraBoldItalic: require('../../assets/fonts/FixelText-ExtraBoldItalic.otf'),
    BodyBlack: require('../../assets/fonts/FixelText-Black.otf'),
    BodyBlackItalic: require('../../assets/fonts/FixelText-BlackItalic.otf'),
  });

  if ((!fontsLoaded && !fontsError) || !devId) {
    return null;
  }

  return (
    <KeyboardProvider>
      <I18nextProvider i18n={i18n}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={scheme}>
          <Body devId={devId} scheme={scheme} />
          <Toaster position="top-right" />
        </TamaguiProvider>
      </I18nextProvider>
    </KeyboardProvider>
  );
};

const Body = ({ devId, scheme }: { devId: string; scheme: Scheme }) => {
  const theme = useTheme();

  const { i18n } = useTranslation();
  // const { token } = useAuthState();
  // const { clear } = useStoreClear();

  const barStyle = useMemo(
    () => (scheme === 'dark' ? 'light-content' : 'dark-content'),
    [scheme]
  );

  const themeProviderValue = useMemo(
    () => ({
      ...DefaultTheme,
      dark: scheme === 'dark',
      colors: {
        ...DefaultTheme.colors,
        background: theme.background?.val,
        text: theme.color?.val,
      },
    }),
    [theme]
  );

  const onNoRespond = useCallback(() => {
    alert('noRespond');
  }, []);

  const onUnauthorized = useCallback(() => {
    alert('onUnauthorized');
  }, []);

  return (
    <ThemeProvider value={themeProviderValue}>
      <ApiProvider
        devId={devId}
        authToken={undefined}
        languageCode={i18n.language}
        onNoRespond={onNoRespond}
        onUnauthorized={onUnauthorized}
      >
        <StatusBar barStyle={barStyle} />

        <Slot />
      </ApiProvider>
    </ThemeProvider>
  );
};
