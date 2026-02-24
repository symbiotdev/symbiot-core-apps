import React, { ForwardedRef } from 'react';
import { SectionList as RNSectionList, SectionListProps } from 'react-native';
import { isWeb } from '@symbiot-core-apps/shared';
import { Refresher } from '../progress/refresher';
import { LoadingView } from '../appearance/loading-view';

export function SectionList<T>({
  listRef,
  refreshing,
  expanding,
  ignoreAnimation,
  progressViewOffset,
  onRefresh,
  onEndReached,
  ...listProps
}: SectionListProps<T> & {
  listRef?: ForwardedRef<RNSectionList>;
  refreshing?: boolean;
  expanding?: boolean;
  ignoreAnimation?: boolean;
  progressViewOffset?: number;
  onRefresh?: () => void;
  onEndReached?: () => void;
}) {
  return (
    <RNSectionList
      stickySectionHeadersEnabled
      ref={listRef}
      keyExtractor={(_, index) => String(index)}
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
          <LoadingView showSpinner={expanding} />
        ) : undefined
      }
      onEndReached={onEndReached}
      {...listProps}
      style={[
        {
          flex: 1,
        },
        listProps.style,
      ]}
      contentContainerStyle={[
        {
          flexGrow: 1,
        },
        listProps.contentContainerStyle,
      ]}
    />
  );
}
