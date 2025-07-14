import { useFonts } from 'expo-font';

export const useFixelFont = () => {
  return useFonts({
    BodyThin: require('../assets/fonts/Fixel//FixelText-Thin.otf'),
    BodyThinItalic: require('../assets/fonts/Fixel//FixelText-ThinItalic.otf'),
    BodyExtraLight: require('../assets/fonts/Fixel//FixelText-ExtraLight.otf'),
    BodyExtraLightItalic: require('../assets/fonts/Fixel//FixelText-ExtraLightItalic.otf'),
    BodyLight: require('../assets/fonts/Fixel//FixelText-Light.otf'),
    BodyLightItalic: require('../assets/fonts/Fixel//FixelText-LightItalic.otf'),
    BodyRegular: require('../assets/fonts/Fixel//FixelText-Regular.otf'),
    BodyRegularItalic: require('../assets/fonts/Fixel//FixelText-RegularItalic.otf'),
    BodyMedium: require('../assets/fonts/Fixel//FixelText-Medium.otf'),
    BodyMediumItalic: require('../assets/fonts/Fixel//FixelText-MediumItalic.otf'),
    BodySemiBold: require('../assets/fonts/Fixel//FixelText-SemiBold.otf'),
    BodySemiBoldItalic: require('../assets/fonts/Fixel//FixelText-SemiBoldItalic.otf'),
    BodyBold: require('../assets/fonts/Fixel//FixelText-Bold.otf'),
    BodyBoldItalic: require('../assets/fonts/Fixel//FixelText-BoldItalic.otf'),
    BodyExtraBold: require('../assets/fonts/Fixel//FixelText-ExtraBold.otf'),
    BodyExtraBoldItalic: require('../assets/fonts/Fixel//FixelText-ExtraBoldItalic.otf'),
    BodyBlack: require('../assets/fonts/Fixel//FixelText-Black.otf'),
    BodyBlackItalic: require('../assets/fonts/Fixel//FixelText-BlackItalic.otf'),
  });
}
