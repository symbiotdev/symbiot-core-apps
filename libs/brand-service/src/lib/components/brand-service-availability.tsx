import {
  BrandService,
  useUpdateBrandServiceQuery,
} from '@symbiot-core-apps/api';
import { useBrandServiceForm } from '../hooks/use-brand-service-form';
import { Card, Switch } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';

export const BrandServiceAvailability = ({
  service,
}: {
  service: BrandService;
}) => {
  const form = useBrandServiceForm();
  const { mutateAsync, isPending } = useUpdateBrandServiceQuery();

  const onChange = useCallback(
    (checked: boolean) =>
      mutateAsync({
        id: service.id,
        data: {
          hidden: !checked,
        },
      }),
    [mutateAsync, service.id],
  );

  return (
    <Card>
      <Switch
        label={form.available.label}
        checked={!service.hidden}
        loading={isPending}
        onChange={onChange}
      />
    </Card>
  );
};
