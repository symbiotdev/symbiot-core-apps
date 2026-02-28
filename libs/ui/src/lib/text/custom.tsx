import { styled, Text as TamaguiText } from 'tamagui';
import { defaultTextStyles } from './text';
import { isWeb } from '@symbiot-core-apps/shared';

export const Error = styled(TamaguiText, {
  ...defaultTextStyles,
  fontSize: 14,
  lineHeight: isWeb ? 16 : undefined,
  color: 'red',
}) as typeof TamaguiText;

export const Link = styled(TamaguiText, {
  cursor: 'pointer',
  color: '$link',
  fontFamily: 'BodyMedium',
}) as typeof TamaguiText;

export const Label = styled(TamaguiText, {
  ...defaultTextStyles,
  fontFamily: 'BodyMedium',
  color: '$placeholder',
});
