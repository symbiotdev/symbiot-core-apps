import { View, ViewProps } from 'react-native';
import { Spinner } from './spinner';
import { memo } from 'react';

export const LoadingContainer = memo(({ style, ...props }: ViewProps) => (
  <View
    {...props}
    style={[
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      style,
    ]}
  >
    <Spinner />
  </View>
));
