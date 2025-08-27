import {
  defaultPageHorizontalPadding,
  FormView,
  H3,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { BrandLocation } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { BrandLocationMediaForm } from './brand-location-media-form';
import { BrandLocationPersonalityForm } from './brand-location-personality-form';
import { BrandLocationLocaleForm } from './brand-location-locale-form';
import { BrandLocationContactForm } from './brand-location-contact-form';
import { BrandLocationScheduleForm } from './brand-location-schedule-form';
import { BrandLocationAdditionalInfo } from './brand-location-additional-info';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';
import { BrandLocationAdvantagesForm } from './brand-location-advantages-form';

export const BrandLocationForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const form = useBrandLocationForm();

  return (
    <PageView scrollable withHeaderHeight withKeyboard gap="$10">
      <FormView>
        <ListItemGroup>
          <BrandLocationAdvantagesForm location={location} />
        </ListItemGroup>
      </FormView>

      <BrandLocationPersonalityForm location={location} />

      <FormView gap="$3">
        <H3 marginBottom="$2" paddingHorizontal={defaultPageHorizontalPadding}>
          {t('shared.media_files')}
        </H3>

        <BrandLocationMediaForm location={location} />
      </FormView>

      <FormView gap="$3" paddingHorizontal={defaultPageHorizontalPadding}>
        <H3 marginBottom="$2">{t('shared.locale')}</H3>

        <BrandLocationLocaleForm location={location} />
      </FormView>

      <FormView gap="$3" paddingHorizontal={defaultPageHorizontalPadding}>
        <H3 marginBottom="$2">{t('shared.contact_information')}</H3>

        <BrandLocationContactForm location={location} />
      </FormView>

      <FormView gap="$3" paddingHorizontal={defaultPageHorizontalPadding}>
        <H3 marginBottom="$2">{form.schedules.title}</H3>

        <BrandLocationScheduleForm location={location} />
      </FormView>

      <FormView gap="$3" paddingHorizontal={defaultPageHorizontalPadding}>
        <H3 marginBottom="$2">{form.remark.title}</H3>

        <BrandLocationAdditionalInfo location={location} />
      </FormView>
    </PageView>
  );
};
