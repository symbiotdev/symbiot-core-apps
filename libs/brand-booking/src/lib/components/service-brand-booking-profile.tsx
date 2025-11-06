import { FormView, PageView } from '@symbiot-core-apps/ui';
import { ServiceBrandBooking } from '@symbiot-core-apps/api';
import { BrandBookingItem } from '@symbiot-core-apps/brand';

export const ServiceBrandBookingProfile = ({
  booking,
}: {
  booking: ServiceBrandBooking;
}) => {
  return (
    <PageView scrollable withHeaderHeight>
      <FormView gap="$5">
        <BrandBookingItem booking={booking} />
      </FormView>
    </PageView>
  );
};
