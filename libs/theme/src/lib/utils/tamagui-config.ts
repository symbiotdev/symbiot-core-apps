import { createFont, createTamagui } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import { animationsCSS } from '@tamagui/config/src/animationsCSS';

type Theme = {
  background: string;
  background1: string;
  color: string;
  error: string;
};

const lightTheme: Theme = {
  background: '#F2F2F2',
  background1: '#FFFFFF',
  color: '#000000',
  error: '#D32F2F'
};

const darkTheme: Theme = {
  background: '#000000',
  background1: '#1A1A1A',
  color: '#FFFFFF',
  error: '#D32F2F'
};

const animations = animationsCSS;
const fonts = {
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
export const themes = {
  light: {
    ...lightTheme,
    ...Object.keys(darkTheme).reduce(
      (obj, key) => ({
        ...obj,
        [`o_${key}`]: darkTheme[key as keyof Theme],
      }),
      {}
    ),
  },
  dark: {
    ...darkTheme,
    ...Object.keys(lightTheme).reduce(
      (obj, key) => ({
        ...obj,
        [`o_${key}`]: lightTheme[key as keyof Theme],
      }),
      {}
    ),
  },
};
const size = {
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
const space = {
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
const zIndex = {
  $true: 1,
};
const radius = {
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

export const tamaguiConfig = createTamagui({
  animations,
  fonts,
  themes,
  tokens: {
    size,
    space,
    zIndex,
    radius,
  },
  settings: {
    defaultFont: 'body',
    fastSchemeChange: true,
    shouldAddPrefersColorThemes: true,
    allowedStyleValues: 'somewhat-strict-web',
    themeClassNameOnRoot: true,
    onlyAllowShorthands: true,
  },
});
