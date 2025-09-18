import { FormView, ListItemGroup, PageView } from '@symbiot-core-apps/ui';
import { BrandService } from '@symbiot-core-apps/api';
import { BrandServiceAvatarForm } from './brand-service-avatar';
import { BrandServiceAvailability } from './brand-service-availability';
import { BrandServiceAboutForm } from './brand-service-about-form';
import { BrandServiceStructureForm } from './brand-service-structure-form';
import { BrandServiceSchedulingForm } from './brand-service-scheduling-form';

export const BrandServiceForm = ({ service }: { service: BrandService }) => {
  return (
    <PageView scrollable withHeaderHeight withKeyboard>
      <BrandServiceAvatarForm service={service} />

      <FormView gap="$2" paddingVertical="$2">
        <BrandServiceAvailability service={service} />

        <ListItemGroup>
          <BrandServiceAboutForm service={service} />
          <BrandServiceStructureForm service={service} />
          <BrandServiceSchedulingForm service={service} />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
