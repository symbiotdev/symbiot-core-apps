import { createFont, createTamagui } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import { createAnimations } from '@tamagui/animations-moti';

type Theme = {
  background: string;
  background1: string;
  color: string;
  colorPress: string;
  error: string;
  link: string;
  placeholder: string;
  disabled: string;
  borderColor: string;
  borderColorHover: string;
  borderColorFocus: string;
  outlineColor: string;
};

const lightTheme: Theme = {
  background: '#F2F2F2',
  background1: '#FFFFFF',
  color: '#000000',
  colorPress: '#000000',
  error: '#C62828',
  link: '#111111',
  placeholder: '#999999',
  disabled: '#999999',
  borderColor: '#111111',
  borderColorHover: 'transparent',
  borderColorFocus: 'transparent',
  outlineColor: 'transparent',
};

const darkTheme: Theme = {
  background: '#000000',
  background1: '#1A1A1A',
  color: '#FFFFFF',
  colorPress: '#FFFFFF',
  error: '#FF6B6B',
  link: '#F5F5F5',
  placeholder: '#999999',
  disabled: '#999999',
  borderColor: '#F5F5F5',
  borderColorHover: 'transparent',
  borderColorFocus: 'transparent',
  outlineColor: 'transparent',
};

const animations = createAnimations({
  '100ms': {
    type: 'timing',
    duration: 100,
  },
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
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
});
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
