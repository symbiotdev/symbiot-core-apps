import { FormView, PageView } from '@symbiot-core-apps/ui';
import { BrandService } from '@symbiot-core-apps/api';
import { BrandServiceAvatarForm } from './brand-service-avatar';

export const BrandServiceForm = ({ service }: { service: BrandService }) => {
  return (
    <PageView scrollable withHeaderHeight withKeyboard>
      <BrandServiceAvatarForm service={service} />

      <FormView gap="$10" paddingVertical="$5"></FormView>
    </PageView>
  );
};
