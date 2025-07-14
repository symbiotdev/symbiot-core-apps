import { Label as TamaguiLabel, styled, Text as TamaguiText } from 'tamagui';
import { defaultTextStyles } from './text';

export const Error = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 12,
  color: '$error',
}) as typeof TamaguiText;

export const Link = styled(TamaguiText, {
  cursor: 'pointer',
  color: '$link',
}) as typeof TamaguiText;

export const Label = styled(TamaguiLabel, {
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 14,
}) as typeof TamaguiLabel;
