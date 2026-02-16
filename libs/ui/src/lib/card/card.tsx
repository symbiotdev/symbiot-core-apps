import { TamaguiElement, View, ViewProps } from 'tamagui';
import { forwardRef, Ref } from 'react';

export const Card = forwardRef((props: ViewProps, ref: Ref<TamaguiElement>) => {
  return (
    <View
      ref={ref}
      backgroundColor="$background1"
      borderRadius="$10"
      padding="$4"
      borderWidth={1}
      borderColor="#FFFFFF20"
      boxShadow="0 0 25px rgba(0, 0, 0, 0.15)"
      overflow="hidden"
      {...props}
    />
  );
});
