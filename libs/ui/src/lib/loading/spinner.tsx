import { Spinner as TamaguiSpinner, styled } from 'tamagui';

export const Spinner = styled(TamaguiSpinner, {
  color: '$buttonBackground',
}) as typeof TamaguiSpinner;
