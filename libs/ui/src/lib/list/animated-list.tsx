import React, { ForwardedRef } from 'react';
import { FlatList, Platform } from 'react-native';
import Animated, {
  EntryExitTransition,
  FlatListPropsWithLayout,
} from 'react-native-reanimated';
import { Refresher } from '../loading/refresher';
import { ListLoadingFooter } from './list-loading-footer';

export function AnimatedList<T>({
  listRef,
  refreshing,
  expanding,
  ignoreAnimation,
  progressViewOffset,
  onRefresh,
  onEndReached,
  ...flatListProps
}: FlatListPropsWithLayout<T> & {
  listRef?: ForwardedRef<FlatList>;
  refreshing?: boolean;
  expanding?: boolean;
  ignoreAnimation?: boolean;
  progressViewOffset?: number;
  onRefresh?: () => void;
  onEndReached?: () => void;
}) {
  return (
    <Animated.FlatList
      ref={listRef}
      keyExtractor={(_, index) => String(index)}
      itemLayoutAnimation={
        Platform.OS === 'web' || ignoreAnimation
          ? undefined
          : EntryExitTransition
      }
      onEndReachedThreshold={0.3}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        typeof refreshing !== 'undefined' ? (
          <Refresher
            refreshing={refreshing}
            progressViewOffset={progressViewOffset}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      ListFooterComponent={
        typeof expanding !== 'undefined' ? (
          <ListLoadingFooter loading={expanding} />
        ) : undefined
      }
      onEndReached={onEndReached}
      // decelerationRate={0.9} // specially for swipe lists and keep the same behaviour on all list
      {...flatListProps}
      contentContainerStyle={[
        {
          flexGrow: 1,
        },
        flatListProps.contentContainerStyle,
      ]}
    />
  );
}
