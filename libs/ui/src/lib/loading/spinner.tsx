import { Spinner as TamaguiSpinner, styled } from 'tamagui';

export const Spinner = styled(TamaguiSpinner, {
  color: '$color',
  width: 18,
  height: 18,
}) as typeof TamaguiSpinner;
