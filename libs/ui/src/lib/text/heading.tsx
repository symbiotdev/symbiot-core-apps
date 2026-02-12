import { styled, Text as TamaguiText } from 'tamagui';
import { defaultTextStyles } from './text';
import { isWeb } from '@symbiot-core-apps/shared';

export const H5 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 12,
  lineHeight: isWeb ? 12 : undefined,
  fontFamily: 'BodyMedium',
}) as typeof TamaguiText;

export const H4 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 16,
  lineHeight: isWeb ? 16 : undefined,
  fontFamily: 'BodySemiBold',
}) as typeof TamaguiText;

export const H3 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 20,
  lineHeight: isWeb ? 20 : undefined,
  fontFamily: 'BodySemiBold',
}) as typeof TamaguiText;

export const H2 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 24,
  lineHeight: isWeb ? 24 : undefined,
  fontFamily: 'BodyBold',
}) as typeof TamaguiText;

export const H1 = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 28,
  lineHeight: isWeb ? 28 : undefined,
  fontFamily: 'BodyBold',
}) as typeof TamaguiText;
