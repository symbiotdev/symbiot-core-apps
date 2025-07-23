import { LoadingView } from './loading-view';
import { ErrorView } from './error-view';
import { EmptyView } from './empty-view';

export const InitView = ({
  loading,
  noDataEmoji,
  noDataTitle,
  noDataMessage,
  error,
}: {
  loading?: boolean;
  noDataEmoji?: string;
  noDataTitle?: string;
  noDataMessage?: string;
  error?: string;
}) => {
  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  return (
    <EmptyView
      emoji={noDataEmoji}
      title={noDataTitle}
      message={noDataMessage}
    />
  );
};
