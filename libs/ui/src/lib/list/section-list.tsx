import React, { ForwardedRef } from 'react';
import {
  Platform,
  SectionList as RNSectionList,
  SectionListProps,
} from 'react-native';
import { Refresher } from '../loading/refresher';
import { ListLoadingFooter } from './list-loading-footer';
import { ViewProps } from 'tamagui';

export function SectionList<T>({
  listRef,
  listLoadingFooterProps,
  refreshing,
  expanding,
  ignoreAnimation,
  progressViewOffset,
  onRefresh,
  onEndReached,
  ...listProps
}: SectionListProps<T> & {
  listRef?: ForwardedRef<RNSectionList>;
  listLoadingFooterProps?: ViewProps;
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
        typeof refreshing !== 'undefined' && Platform.OS !== 'web' ? (
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
