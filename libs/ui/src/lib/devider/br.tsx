import { View, ViewStyle } from 'tamagui';

export const Br = (props: ViewStyle) => (
  <View height={2} backgroundColor="$background" {...props} />
);
