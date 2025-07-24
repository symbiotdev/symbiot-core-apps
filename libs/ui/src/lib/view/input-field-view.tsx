import { XStack, XStackProps } from 'tamagui';

export const InputFieldView = (props: XStackProps) => {
  return (
    <XStack
      backgroundColor="$background1"
      width="100%"
      gap="$5"
      height={46}
      borderRadius="$10"
      paddingHorizontal="$6"
      borderColor="$borderColor"
      alignItems="center"
      opacity={props.disabled ? 0.8 : 1}
      cursor={!props.disabled ? 'pointer' : 'auto'}
      pressStyle={{ opacity: 0.8 }}
      {...props}
    />
  );
};
