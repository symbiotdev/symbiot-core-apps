import { TamaguiElement, View, ViewProps } from 'tamagui';
import { forwardRef, Ref } from 'react';

export const Card = forwardRef((props: ViewProps, ref: Ref<TamaguiElement>) => {
  return (
    <View
      ref={ref}
      backgroundColor="$background1"
      borderRadius="$10"
      padding="$4"
      {...props}
    />
  );
});
