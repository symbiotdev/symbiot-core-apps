import React from 'react';
import { View, ViewProps } from 'tamagui';

export const AttentionView = ({
  attention,
  children,
  dotProps,
  ...viewProps
}: ViewProps & {
  attention: boolean;
  dotProps?: ViewProps;
}) => {
  return (
    <View position="relative" {...viewProps}>
      {children}

      {attention && (
        <View
          width={5}
          height={5}
          borderRadius={50}
          backgroundColor="$error"
          position="absolute"
          right={-2}
          top={-2}
          {...dotProps}
        />
      )}
    </View>
  );
};
