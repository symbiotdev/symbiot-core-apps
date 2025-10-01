import { BrandService } from '@symbiot-core-apps/api';
import {
  Avatar,
  FormView,
  ListItemGroup,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { useWindowDimensions } from 'react-native';
import {
  BrandEmployeeItem,
  BrandLocationItem,
  BrandServiceItem,
  useAnyBrandLocation,
} from '@symbiot-core-apps/brand';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { router } from 'expo-router';

export const BrandServiceProfile = ({ service }: { service: BrandService }) => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const anyLocation = useAnyBrandLocation();

  return (
    <PageView scrollable withHeaderHeight>
      <Avatar
        name={service.name}
        url={service.avatarXsUrl}
        borderRadius="$10"
        color="$background1"
        size={{
          width: '100%',
          height: Math.max(height / 3, 250),
        }}
      />

      <FormView marginTop="$3" gap="$2">
        <BrandServiceItem
          backgroundColor="$background1"
          borderRadius="$10"
          padding="$4"
          service={service}
        />

        {!!service.description && (
          <ListItemGroup
            paddingVertical="$4"
            title={t('brand_service.profile.description')}
          >
            <RegularText>{service.description}</RegularText>
          </ListItemGroup>
        )}

        {!!service.employees?.length && (
          <ListItemGroup
            paddingVertical="$4"
            title={t('brand_service.profile.employees')}
            disabled={!service.locations}
          >
            {service.employees.map((employee) => (
              <BrandEmployeeItem
                key={employee.id}
                employee={employee}
                onPress={() => router.push(`/employees/${employee.id}/profile`)}
              />
            ))}
          </ListItemGroup>
        )}

        <ListItemGroup
          paddingVertical="$4"
          title={t('brand_service.profile.location')}
          disabled={!service.locations}
        >
          {service.locations?.length ? (
            service.locations.map((location) => (
              <BrandLocationItem
                key={location.id}
                location={location}
                brand={brand}
                onPress={() => router.push(`/locations/${location.id}/profile`)}
              />
            ))
          ) : (
            <RegularText>{anyLocation.label}</RegularText>
          )}
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
