import { styled, Text as TamaguiText } from 'tamagui';
import { defaultTextStyles } from './text';

export const H5 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 12,
  lineHeight: 12,
  fontFamily: 'BodyMedium',
}) as typeof TamaguiText;

export const H4 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 16,
  lineHeight: 16,
  fontFamily: 'BodySemiBold',
}) as typeof TamaguiText;

export const H3 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 20,
  lineHeight: 20,
  fontFamily: 'BodySemiBold',
}) as typeof TamaguiText;

export const H2 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 24,
  lineHeight: 24,
  fontFamily: 'BodyBold',
}) as typeof TamaguiText;

export const H1 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 28,
  lineHeight: 28,
  fontFamily: 'BodyBold',
}) as typeof TamaguiText;
