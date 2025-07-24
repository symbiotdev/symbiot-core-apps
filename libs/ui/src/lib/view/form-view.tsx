import { View, ViewProps } from 'tamagui';

export const FormView = (props: ViewProps) => {
  return (
    <View
      marginHorizontal="auto"
      width="100%"
      gap="$3"
      maxWidth={512}
      {...props}
    />
  );
};
