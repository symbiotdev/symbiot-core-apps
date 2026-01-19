import { createFont } from 'tamagui';
import { createAnimations } from '@tamagui/animations-react-native';
import { SCREEN_MEDIA_SIZE } from '@symbiot-core-apps/shared';

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
  quickest: {
    type: 'spring',
    damping: 50,
    mass: 0.5,
    stiffness: 200,
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
    size: {},
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
  $true: 5,
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
  xl: { maxWidth: SCREEN_MEDIA_SIZE.xl },
  lg: { maxWidth: SCREEN_MEDIA_SIZE.lg },
  md: { maxWidth: SCREEN_MEDIA_SIZE.md },
  sm: { maxWidth: SCREEN_MEDIA_SIZE.sm },
  xs: { maxWidth: SCREEN_MEDIA_SIZE.xs },
  xxs: { maxWidth: SCREEN_MEDIA_SIZE.xxs },
  gtXs: { minWidth: SCREEN_MEDIA_SIZE.xs + 1 },
  gtSm: { minWidth: SCREEN_MEDIA_SIZE.sm + 1 },
  gtMd: { minWidth: SCREEN_MEDIA_SIZE.md + 1 },
  gtLg: { minWidth: SCREEN_MEDIA_SIZE.lg + 1 },
  gtXl: { minWidth: SCREEN_MEDIA_SIZE.xl + 1 },
};

export const mediaQueryDefaultActive = {
  xl: true,
  lg: true,
  md: true,
  sm: true,
  xs: true,
  xxs: true,
};
