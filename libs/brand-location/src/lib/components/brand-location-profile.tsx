import {
  BrandLocation,
  useCurrentBrandEmployeeProvidersByLocationListReq,
} from '@symbiot-core-apps/api';
import {
  Avatar,
  ButtonIcon,
  Chip,
  FormView,
  H3,
  InitView,
  ListItemGroup,
  MapsTrigger,
  MediumText,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { BrandEmployeeItem, BrandSchedule } from '@symbiot-core-apps/brand';
import React from 'react';
import { View, XStack } from 'tamagui';
import { Linking } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandLocationCompletion } from './brand-location-completion';

export const BrandLocationProfile = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useCurrentBrandEmployee();
  const { items, isPending, error } =
    useCurrentBrandEmployeeProvidersByLocationListReq({
      location: location.id,
      params: {
        take: 999,
      },
    });

  return (
    <PageView scrollable withHeaderHeight>
      <FormView alignItems="center" gap="$5" flex={1}>
        <View gap="$2" alignItems="center">
          <Avatar
            name={location.name}
            size={100}
            url={location.avatar?.xsUrl}
            color="$background1"
          />

          <H3 marginTop="$1" textAlign="center">
            {location.name}
          </H3>

          <XStack justifyContent="center" gap="$2" marginTop="$4">
            <ButtonIcon
              iconName="Phone"
              size={40}
              iconSize={20}
              iconStyle={{ marginLeft: -2, marginBottom: -2 }}
              disabled={!location.phones?.length}
              onPress={() => Linking.openURL(`tel:${location.phones[0]}`)}
            />

            <ButtonIcon
              iconName="Letter"
              size={40}
              iconSize={20}
              disabled={!location.emails?.length}
              onPress={() => Linking.openURL(`mailto:${location.emails[0]}`)}
            />

            {!!location.instagrams?.length && (
              <ButtonIcon
                iconName="Instagram"
                size={40}
                iconSize={20}
                onPress={() => openBrowserAsync(location.instagrams[0])}
              />
            )}

            <MapsTrigger
              address={location.address}
              trigger={
                <ButtonIcon iconName="MapPoint" size={40} iconSize={20} />
              }
            />
          </XStack>
        </View>

        {hasPermission('locations') && (
          <BrandLocationCompletion location={location} />
        )}

        <ListItemGroup
          paddingVertical={0}
          paddingHorizontal="$3"
          backgroundColor="transparent"
          title={t('brand_location.profile.address')}
        >
          <MediumText fontSize={18}>
            {location.country.flag} {location.address}
          </MediumText>

          {!!location.entrance && (
            <RegularText>{`${t('brand_location.profile.entrance')}: ${location.entrance}`}</RegularText>
          )}

          {!!location.floor && (
            <RegularText>{`${t('brand_location.profile.floor')}: ${location.floor}`}</RegularText>
          )}
        </ListItemGroup>

        <BrandSchedule schedules={location.schedules} />

        {!!location.advantages?.length && (
          <ListItemGroup
            paddingVertical={0}
            paddingHorizontal={0}
            backgroundColor="transparent"
            flexDirection="row"
            flexWrap="wrap"
            title={t('brand_location.profile.advantages')}
          >
            {location.advantages.map((advantage) => (
              <Chip
                type="highlighted"
                key={advantage.value}
                label={advantage.label}
              />
            ))}
          </ListItemGroup>
        )}

        {!items ? (
          <InitView loading={isPending} error={error} />
        ) : (
          <ListItemGroup
            gap="$1"
            paddingVertical={0}
            paddingHorizontal={0}
            backgroundColor="transparent"
            title={t('brand_location.profile.providers')}
          >
            {items.map((employee) => (
              <BrandEmployeeItem
                backgroundColor="$background1"
                borderRadius="$10"
                padding="$4"
                key={employee.id}
                employee={employee}
                onPress={() => router.push(`/employees/${employee.id}/profile`)}
              />
            ))}
          </ListItemGroup>
        )}

        <ListItemGroup
          paddingVertical={0}
          paddingHorizontal="$3"
          backgroundColor="transparent"
          title={t('brand_location.profile.remark')}
        >
          <RegularText>
            {location.remark?.trim() || t('shared.not_specified')}
          </RegularText>
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
