import { styled, Text as TamaguiText } from 'tamagui';
import { defaultTextStyles } from './text';
import { Platform } from 'react-native';

export const H5 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 12,
  lineHeight: Platform.OS === 'web' ? 12 : undefined,
  fontFamily: 'BodyMedium',
}) as typeof TamaguiText;

export const H4 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 16,
  lineHeight: Platform.OS === 'web' ? 16 : undefined,
  fontFamily: 'BodySemiBold',
}) as typeof TamaguiText;

export const H3 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 20,
  lineHeight: Platform.OS === 'web' ? 20 : undefined,
  fontFamily: 'BodySemiBold',
}) as typeof TamaguiText;

export const H2 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 24,
  lineHeight: Platform.OS === 'web' ? 24 : undefined,
  fontFamily: 'BodyBold',
}) as typeof TamaguiText;

export const H1 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 28,
  lineHeight: Platform.OS === 'web' ? 28 : undefined,
  fontFamily: 'BodyBold',
}) as typeof TamaguiText;
