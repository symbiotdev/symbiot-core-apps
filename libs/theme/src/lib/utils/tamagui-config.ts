import { createFont } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import { createAnimations } from '@tamagui/animations-react-native'

export type ThemeConfig = {
  background: string;
  background1: string;
  color: string;
  colorPress: string;
  error: string;
  link: string;
  disabled: string;
  highlighted: string;
  borderColor: string;
  borderColorHover: string;
  borderColorFocus: string;
  outlineColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  buttonTextColor1: string;
  checkboxColor: string;
  inputBackgroundColor: string;
  placeholderColor: string;
  tabBarActiveTintColor: string;
  tabBarInactiveTintColor: string;
  qrCode: string;
  qrCodeGradientFrom: string;
  qrCodeGradientTo: string;
  calendarLineColor: string;
  calendarTimeColor: string;
  calendarTodayColor: string;
  calendarNowIndicatorColor: string;
  switchSelectedColor: string;
};

export const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  lazy: {
    type: 'spring',
    damping: 18,
    stiffness: 50,
  },
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  slow: {
    type: 'spring',
    damping: 15,
    stiffness: 40,
  },
  quick: {
    type: 'spring',
    damping: 100,
    mass: 1,
    stiffness: 250,
  },
  tooltip: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
});
export const fonts = {
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
};
export const size = {
  $true: 20,
  $1: 4,
  $2: 8,
  $3: 12,
  $4: 16,
  $5: 20,
  $6: 24,
  $7: 28,
  $8: 32,
  $9: 36,
  $10: 40,
};
export const space = {
  $true: 5,
  $1: 4,
  $2: 8,
  $3: 12,
  $4: 16,
  $5: 20,
  $6: 24,
  $7: 28,
  $8: 32,
  $9: 36,
  $10: 40,
};
export const zIndex = {
  $true: 1,
};
export const radius = {
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
  6: 12,
  7: 14,
  8: 16,
  9: 18,
  10: 20,
};

export const media = {
  xl: { maxWidth: 1650 },
  lg: { maxWidth: 1280 },
  md: { maxWidth: 1020 },
  sm: { maxWidth: 800 },
  xs: { maxWidth: 660 },
  xxs: { maxWidth: 390 },
  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  gtXl: { minWidth: 1650 + 1 },
}

export const mediaQueryDefaultActive = {
  xl: true,
  lg: true,
  md: true,
  sm: true,
  xs: true,
  xxs: true,
}

