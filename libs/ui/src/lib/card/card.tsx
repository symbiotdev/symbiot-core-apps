import { View, ViewProps } from 'tamagui';

export const Card = (props: ViewProps) => {
  return (
    <View
      backgroundColor="$background1"
      borderRadius="$10"
      padding="$4"
      {...props}
    />
  );
};
