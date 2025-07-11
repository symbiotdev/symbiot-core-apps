import { Slot } from 'expo-router';
import { useCallback } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ApiProvider } from '@symbiot-core-apps/api';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { i18n } from '@symbiot-core-apps/i18n';
import { useDevId } from '@symbiot-core-apps/shared';
import { Toaster } from 'burnt/web';
import { useFonts } from 'expo-font';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';

const tamaguiConfig = createTamagui({
  ...defaultConfig,
});

export default () => {
  const devId = useDevId();

  const [fontsLoaded, fontsError] = useFonts({
    BodyBlack: require('../../assets/fonts/FixelText-Black.otf'),
    BodyBlackItalic: require('../../assets/fonts/FixelText-BlackItalic.otf'),
    BodyBold: require('../../assets/fonts/FixelText-Bold.otf'),
    BodyBoldItalic: require('../../assets/fonts/FixelText-BoldItalic.otf'),
    BodyExtraBold: require('../../assets/fonts/FixelText-ExtraBold.otf'),
    BodyExtraBoldItalic: require('../../assets/fonts/FixelText-ExtraBoldItalic.otf'),
    BodyExtraLight: require('../../assets/fonts/FixelText-ExtraLight.otf'),
    BodyExtraLightItalic: require('../../assets/fonts/FixelText-ExtraLightItalic.otf'),
    BodyLight: require('../../assets/fonts/FixelText-Light.otf'),
    BodyLightItalic: require('../../assets/fonts/FixelText-LightItalic.otf'),
    BodyMedium: require('../../assets/fonts/FixelText-Medium.otf'),
    BodyMediumItalic: require('../../assets/fonts/FixelText-MediumItalic.otf'),
    BodyRegular: require('../../assets/fonts/FixelText-Regular.otf'),
    BodyRegularItalic: require('../../assets/fonts/FixelText-RegularItalic.otf'),
    BodySemiBold: require('../../assets/fonts/FixelText-SemiBold.otf'),
    BodySemiBoldItalic: require('../../assets/fonts/FixelText-SemiBoldItalic.otf'),
    BodyThin: require('../../assets/fonts/FixelText-Thin.otf'),
    BodyThinItalic: require('../../assets/fonts/FixelText-ThinItalic.otf'),
  });

  if ((!fontsLoaded && !fontsError) || !devId) {
    return null;
  }

  return (
    <KeyboardProvider>
      <I18nextProvider i18n={i18n}>
        <TamaguiProvider config={tamaguiConfig}>
          <Body devId={devId} />
          <Toaster position="top-right" />
        </TamaguiProvider>
      </I18nextProvider>
    </KeyboardProvider>
  );
};

const Body = ({ devId }: { devId: string }) => {
  const { i18n } = useTranslation();
  // const { token } = useAuthState();
  // const { clear } = useStoreClear();

  const onNoRespond = useCallback(() => {
    alert('noRespond');
  }, []);

  const onUnauthorized = useCallback(() => {
    alert('onUnauthorized');
  }, []);

  return (
    <ApiProvider
      devId={devId}
      authToken={undefined}
      languageCode={i18n.language}
      onNoRespond={onNoRespond}
      onUnauthorized={onUnauthorized}
    >
      <Slot />
    </ApiProvider>
  );
};
