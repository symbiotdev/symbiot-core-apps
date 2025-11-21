import { Label as TamaguiLabel, styled, Text as TamaguiText } from 'tamagui';
import { defaultTextStyles } from './text';
import { Platform } from 'react-native';

export const Error = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 14,
  lineHeight: Platform.OS === 'web' ? 16 : undefined,
  color: '$error',
}) as typeof TamaguiText;

export const Link = styled(TamaguiText, {
  cursor: 'pointer',
  color: '$link',
  fontFamily: 'BodyMedium',
}) as typeof TamaguiText;

export const Label = styled(TamaguiText, {
  ...defaultTextStyles,
  fontFamily: 'BodyMedium',
  color: '$placeholderColor',
}) as typeof TamaguiLabel;
