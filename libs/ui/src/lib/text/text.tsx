import {
  styled,
  Text as TamaguiText,
  TextNonStyleProps,
  TextStyle,
} from 'tamagui';
import { Platform } from 'react-native';

export const defaultTextStyles: TextNonStyleProps & TextStyle = {
  maxWidth: '100%',
  allowFontScaling: true,
  fontSize: 14,
  lineHeight: Platform.OS === 'web' ? 14 : undefined,
  userSelect: 'none',
};

export const LightText = styled(TamaguiText, {
  ...defaultTextStyles,
  fontFamily: 'BodyLight',
}) as typeof TamaguiText;

export const RegularText = styled(TamaguiText, {
  ...defaultTextStyles,
  fontFamily: 'BodyRegular',
}) as typeof TamaguiText;

export const MediumText = styled(TamaguiText, {
  ...defaultTextStyles,
  fontFamily: 'BodyMedium',
}) as typeof TamaguiText;

export const SemiBoldText = styled(TamaguiText, {
  ...defaultTextStyles,
  fontFamily: 'BodySemiBold',
}) as typeof TamaguiText;

export const BoldText = styled(TamaguiText, {
  ...defaultTextStyles,
  fontFamily: 'BodySemiBold',
}) as typeof TamaguiText;

export const ExtraBoldText = styled(TamaguiText, {
  ...defaultTextStyles,
  fontFamily: 'BodyExtraBold',
}) as typeof TamaguiText;

export const BlackText = styled(TamaguiText, {
  ...defaultTextStyles,
  fontFamily: 'BodyBlack',
}) as typeof TamaguiText;
