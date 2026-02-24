import { View, ViewProps } from 'react-native';
import { memo } from 'react';
import { Spinner } from '../progress/spinner';

export const LoadingView = memo(
  ({
    style,
    showSpinner = true,
    ...props
  }: ViewProps & { showSpinner?: boolean }) => (
    <View
      {...props}
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
        },
        style,
      ]}
    >
      {showSpinner && <Spinner />}
    </View>
  ),
);
