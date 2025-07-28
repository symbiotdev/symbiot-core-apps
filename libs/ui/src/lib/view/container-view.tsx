import { View, ViewProps } from 'tamagui';

export const ContainerView = (props: ViewProps) => {
  return (
    <View maxWidth={1280} width="100%" marginHorizontal="auto" {...props} />
  );
};
