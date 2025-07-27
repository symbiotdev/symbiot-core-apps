import { View, ViewProps } from 'tamagui';

// fixme: find out better name
export const FormView = (props: ViewProps) => {
  return (
    <View
      marginHorizontal="auto"
      width="100%"
      gap="$3"
      maxWidth={600}
      {...props}
    />
  );
};
