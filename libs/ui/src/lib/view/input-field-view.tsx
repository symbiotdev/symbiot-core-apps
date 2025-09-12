import { XStack, XStackProps } from 'tamagui';

export const InputHeight = 46;

export const InputFieldView = (props: XStackProps) => {
  return (
    <XStack
      backgroundColor="$background1"
      width="100%"
      gap="$5"
      height={InputHeight}
      borderRadius="$10"
      paddingHorizontal="$4"
      borderColor="$borderColor"
      alignItems="center"
      opacity={props.disabled ? 0.8 : 1}
      cursor={!props.disabled ? 'pointer' : 'auto'}
      {...props}
    />
  );
};
