import { useFonts } from 'expo-font';

export const useFixelFont = () => {
  return useFonts({
    BodyThin: require('../assets/fonts/Fixel/FixelDisplay-Thin.otf'),
    BodyThinItalic: require('../assets/fonts/Fixel/FixelDisplay-ThinItalic.otf'),
    BodyExtraLight: require('../assets/fonts/Fixel/FixelDisplay-ExtraLight.otf'),
    BodyExtraLightItalic: require('../assets/fonts/Fixel/FixelDisplay-ExtraLightItalic.otf'),
    BodyLight: require('../assets/fonts/Fixel/FixelDisplay-Light.otf'),
    BodyLightItalic: require('../assets/fonts/Fixel/FixelDisplay-LightItalic.otf'),
    BodyRegular: require('../assets/fonts/Fixel/FixelDisplay-Regular.otf'),
    BodyRegularItalic: require('../assets/fonts/Fixel/FixelDisplay-RegularItalic.otf'),
    BodyMedium: require('../assets/fonts/Fixel/FixelDisplay-Medium.otf'),
    BodyMediumItalic: require('../assets/fonts/Fixel/FixelDisplay-MediumItalic.otf'),
    BodySemiBold: require('../assets/fonts/Fixel/FixelDisplay-SemiBold.otf'),
    BodySemiBoldItalic: require('../assets/fonts/Fixel/FixelDisplay-SemiBoldItalic.otf'),
    BodyBold: require('../assets/fonts/Fixel/FixelDisplay-Bold.otf'),
    BodyBoldItalic: require('../assets/fonts/Fixel/FixelDisplay-BoldItalic.otf'),
    BodyExtraBold: require('../assets/fonts/Fixel/FixelDisplay-ExtraBold.otf'),
    BodyExtraBoldItalic: require('../assets/fonts/Fixel/FixelDisplay-ExtraBoldItalic.otf'),
    BodyBlack: require('../assets/fonts/Fixel/FixelDisplay-Black.otf'),
    BodyBlackItalic: require('../assets/fonts/Fixel/FixelDisplay-BlackItalic.otf'),
  });
}
