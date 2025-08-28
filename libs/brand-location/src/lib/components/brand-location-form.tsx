import {
  defaultPageHorizontalPadding,
  FormView,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { BrandLocation } from '@symbiot-core-apps/api';
import { BrandLocationMediaForm } from './brand-location-media-form';
import { BrandLocationPersonalityForm } from './brand-location-personality-form';
import { BrandLocationLocaleForm } from './brand-location-locale-form';
import { BrandLocationContactForm } from './brand-location-contact-form';
import { BrandLocationScheduleForm } from './brand-location-schedule-form';
import { BrandLocationAdvantagesForm } from './brand-location-advantages-form';
import { BrandLocationAddressForm } from './brand-location-address-form';

export const BrandLocationForm = ({
  location,
}: {
  location: BrandLocation;
}) => (
  <PageView
    scrollable
    withHeaderHeight
    withKeyboard
    gap="$5"
    paddingHorizontal={0}
  >
    <FormView>
      <BrandLocationMediaForm location={location} />
    </FormView>

    <FormView paddingHorizontal={defaultPageHorizontalPadding}>
      <BrandLocationPersonalityForm location={location} />

      <ListItemGroup>
        <BrandLocationAddressForm location={location} />
        <BrandLocationScheduleForm location={location} />
        <BrandLocationLocaleForm location={location} />
        <BrandLocationAdvantagesForm location={location} />
        <BrandLocationContactForm location={location} />
      </ListItemGroup>
    </FormView>
  </PageView>
);
