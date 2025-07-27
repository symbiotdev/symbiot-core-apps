import { View, ViewProps } from 'tamagui';
import React from 'react';
import { Spinner } from '../loading/spinner';

export const ListLoadingFooter = ({
  loading,
  ...viewProps
}: ViewProps & {
  loading?: boolean;
}) => {
  if (!loading) {
    return <View height={18} />;
  }

  return (
    <View padding={12} alignItems="center" {...viewProps}>
      <Spinner />
    </View>
  );
};
