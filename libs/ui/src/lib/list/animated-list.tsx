import React, { ForwardedRef } from 'react';
import { FlatList } from 'react-native';
import Animated, {
  FadingTransition,
  FlatListPropsWithLayout,
} from 'react-native-reanimated';
import { ListLoadingFooter } from './list-loading-footer';
import { ViewProps } from 'tamagui';
import { isWeb } from '@symbiot-core-apps/shared';
import { Refresher } from '@symbiot-core-apps/ui2';

export function AnimatedList<T>({
  listRef,
  listLoadingFooterProps,
  refreshing,
  expanding,
  ignoreAnimation,
  progressViewOffset,
  onRefresh,
  ...flatListProps
}: FlatListPropsWithLayout<T> & {
  listRef?: ForwardedRef<FlatList>;
  listLoadingFooterProps?: ViewProps;
  refreshing?: boolean;
  expanding?: boolean;
  ignoreAnimation?: boolean;
  progressViewOffset?: number;
  onRefresh?: () => void;
}) {
  return (
    <Animated.FlatList
      ref={listRef}
      keyExtractor={(_, index) => String(index)}
      itemLayoutAnimation={
        isWeb || ignoreAnimation ? undefined : FadingTransition
      }
      onEndReachedThreshold={0.3}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        typeof refreshing !== 'undefined' && !isWeb ? (
          <Refresher
            refreshing={refreshing}
            progressViewOffset={progressViewOffset}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      ListFooterComponent={
        typeof expanding !== 'undefined' ? (
          <ListLoadingFooter loading={expanding} {...listLoadingFooterProps} />
        ) : undefined
      }
      // decelerationRate={0.9} // specially for swipe lists and keep the same behaviour on all list
      {...flatListProps}
      style={[
        {
          flex: 1,
        },
        flatListProps.style,
      ]}
      contentContainerStyle={[
        {
          flexGrow: 1,
        },
        flatListProps.contentContainerStyle,
      ]}
    />
  );
}
