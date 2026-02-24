import { memo } from 'react';
import { ViewProps } from 'react-native';
import { LoadingView } from './loading-view';
import { FalseView } from './false-view';
import { EmptyView } from './empty-view';
import { IconName } from '../icon/icon';

export const FallbackView = memo(
  ({
    loading,
    noDataIcon,
    noDataTitle,
    noDataMessage,
    error,
    ...viewProps
  }: ViewProps & {
    loading?: boolean;
    noDataIcon?: IconName;
    noDataTitle?: string;
    noDataMessage?: string;
    error?: string | null;
  }) => {
    if (loading) return <LoadingView {...viewProps} />;
    else if (error) return <FalseView message={error} {...viewProps} />;
    else
      return (
        <EmptyView
          iconName={noDataIcon}
          title={noDataTitle}
          message={noDataMessage}
          {...viewProps}
        />
      );
  },
);
