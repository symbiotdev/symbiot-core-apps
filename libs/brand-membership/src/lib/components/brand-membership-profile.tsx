import { BrandMembership } from '@symbiot-core-apps/api';
import {
  FormView,
  ListItemGroup,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import {
  BrandLocationItem,
  BrandMembershipItem,
  BrandServiceItem,
  useAllBrandLocation,
  useAnyBrandService,
} from '@symbiot-core-apps/brand';

export const BrandMembershipProfile = ({
  membership,
}: {
  membership: BrandMembership;
}) => {
  const { t } = useTranslation();
  const anyService = useAnyBrandService();
  const allLocations = useAllBrandLocation();
  const { brand } = useCurrentBrandState();

  return (
    <PageView scrollable withHeaderHeight>
      <BrandMembershipItem membership={membership} />

      <FormView gap="$5" marginVertical="$5">
        {!!membership.description && (
          <ListItemGroup
            paddingVertical="$4"
            title={t('brand_membership.profile.description')}
          >
            <RegularText>{membership.description}</RegularText>
          </ListItemGroup>
        )}

        <ListItemGroup
          gap="$4"
          paddingVertical="$4"
          title={t('brand_membership.profile.services')}
        >
          {membership.services?.length ? (
            membership.services.map((service, index) => (
              <BrandServiceItem
                borderTopWidth={!index ? 0 : 1}
                paddingTop={!index ? 0 : '$4'}
                borderTopColor="$background"
                hidePricing
                key={service.id}
                service={service}
                navigateTo="profile"
              />
            ))
          ) : (
            <RegularText>{anyService.label}</RegularText>
          )}
        </ListItemGroup>

        <ListItemGroup
          paddingVertical="$4"
          title={t('brand_membership.profile.location')}
          disabled={!membership.location}
        >
          {membership.location ? (
            <BrandLocationItem
              location={membership.location}
              brand={brand}
              navigateTo="profile"
            />
          ) : (
            <RegularText>{allLocations.label}</RegularText>
          )}
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
