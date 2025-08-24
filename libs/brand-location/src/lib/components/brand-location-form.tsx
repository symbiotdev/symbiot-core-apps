import { InitView, PageView } from '@symbiot-core-apps/ui';
import { useBrandLocationByIdQuery } from '@symbiot-core-apps/api';

export const BrandLocationForm = ({ id }: { id: string }) => {
  const { data, error, isPending } = useBrandLocationByIdQuery(id);

  if (!data || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <PageView scrollable withHeaderHeight></PageView>;
};
