import { View, ViewProps } from 'tamagui';
import { Spinner } from '../loading/spinner';

export const LoadingView = (props: ViewProps) => {
  return (
    <View
      justifyContent="center"
      alignItems="center"
      flex={1}
      padding={20}
      {...props}
    >
      <Spinner />
    </View>
  );
};
