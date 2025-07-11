import { Spinner as TamaguiSpinner, styled } from 'tamagui';

export const Spinner = styled(TamaguiSpinner, {
  color: '$color',
  width: 20,
  height: 20,
}) as typeof TamaguiSpinner;
