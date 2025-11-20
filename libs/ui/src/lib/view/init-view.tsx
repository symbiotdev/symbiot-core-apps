import { LoadingView } from './loading-view';
import { ErrorView } from './error-view';
import { EmptyView } from './empty-view';
import { ViewProps } from 'tamagui';
import { IconName } from '../icons';

export const InitView = ({
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
  if (loading) {
    return <LoadingView {...viewProps} />;
  }

  if (error) {
    return <ErrorView message={error} {...viewProps} />;
  }

  return (
    <EmptyView
      iconName={noDataIcon}
      title={noDataTitle}
      message={noDataMessage}
      {...viewProps}
    />
  );
};
