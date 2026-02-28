import React, { ForwardedRef } from 'react';
import { FlatList } from 'react-native';
import Animated, {
  FadingTransition,
  FlatListPropsWithLayout,
} from 'react-native-reanimated';
import { isWeb } from '@symbiot-core-apps/shared';
import { Refresher } from '../progress/refresher';
import { LoadingView } from '../appearance/loading-view';

export type AnimatedListProps<T> = FlatListPropsWithLayout<T> & {
  listRef?: ForwardedRef<FlatList>;
  refreshing?: boolean;
  expanding?: boolean;
  ignoreAnimation?: boolean;
  progressViewOffset?: number;
  onRefresh?: () => void;
};

export function AnimatedList<T>({
  style,
  listRef,
  refreshing,
  expanding,
  ignoreAnimation,
  progressViewOffset,
  contentContainerStyle,
  onRefresh,
  ...flatListProps
}: AnimatedListProps<T>) {
  return (
    <Animated.FlatList
      ref={listRef}
      keyExtractor={(_, index) => String(index)}
      onEndReachedThreshold={0.3}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      itemLayoutAnimation={
        isWeb || ignoreAnimation ? undefined : FadingTransition
      }
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
          <LoadingView showSpinner={expanding} />
        ) : undefined
      }
      {...flatListProps}
      style={[
        {
          flexShrink: 1,
        },
        style,
      ]}
      contentContainerStyle={[
        {
          flexGrow: 1,
        },
        contentContainerStyle,
      ]}
    />
  );
}
