import { LoadingView } from './loading-view';
import { ErrorView } from './error-view';
import { EmptyView } from './empty-view';
import { IconName } from '../icons/config';

export const InitView = ({
  loading,
  noDataIcon,
  noDataTitle,
  noDataMessage,
  error,
}: {
  loading?: boolean;
  noDataIcon?: IconName;
  noDataTitle?: string;
  noDataMessage?: string;
  error?: string | null;
}) => {
  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  return (
    <EmptyView
      iconName={noDataIcon}
      title={noDataTitle}
      message={noDataMessage}
    />
  );
};
