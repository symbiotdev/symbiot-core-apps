import {
  BrandLocation,
  useCurrentBrandEmployeeProvidersByLocationListReq,
} from '@symbiot-core-apps/api';
import {
  Avatar,
  avatarBlurhash,
  ButtonIcon,
  Chip,
  defaultPageHorizontalPadding,
  FormView,
  H3,
  InitView,
  ListItemGroup,
  MapsTrigger,
  MediumText,
  PageView,
  RegularText,
  SimpleHorizontalCarousel,
} from '@symbiot-core-apps/ui';
import { BrandEmployeeItem, BrandSchedule } from '@symbiot-core-apps/brand';
import React, { useState } from 'react';
import { View, XStack } from 'tamagui';
import { Linking, useWindowDimensions } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { BrandLocationCompletion } from './brand-location-completion';
import { Image } from 'expo-image';

export const BrandLocationProfile = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const { brand } = useCurrentBrandState();
  const { height } = useWindowDimensions();
  const { hasPermission } = useCurrentBrandEmployee();
  const { items, isPending, error } =
    useCurrentBrandEmployeeProvidersByLocationListReq({
      location: location.id,
      params: {
        take: 999,
      },
    });

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const galleryImageHeight = Math.max(height / 4, 200);

  return (
    <PageView
      scrollable
      withHeaderHeight
      scrollEnabled={scrollEnabled}
      paddingLeft={0}
      paddingRight={0}
    >
      {!!location.gallery?.length && (
        <View height={galleryImageHeight} width="100%" position="relative">
          <SimpleHorizontalCarousel
            id="symbiot-location-profile-gallery"
            showCounter={location.gallery?.length > 1}
            onStartSwipe={() => setScrollEnabled(false)}
            onEndSwipe={() => setScrollEnabled(true)}
          >
            {location.gallery.map(({ url }, index) => (
              <Image
                key={index}
                source={url}
                placeholder={{
                  blurhash: avatarBlurhash,
                }}
                style={{
                  height: galleryImageHeight,
                  width: '100%',
                }}
              />
            ))}
          </SimpleHorizontalCarousel>
        </View>
      )}

      <FormView
        alignItems="center"
        gap="$5"
        flex={1}
        marginTop={location?.gallery?.length ? -50 : 0}
        paddingHorizontal={defaultPageHorizontalPadding}
      >
        <View gap="$2" alignItems="center">
          <Avatar
            name={location.name}
            size={100}
            url={location.avatar?.url || brand?.avatar?.url}
            color="$background1"
          />

          <H3 marginTop="$1" textAlign="center">
            {location.name}
          </H3>

          <XStack justifyContent="center" gap="$2" marginTop="$2">
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
                iconSize={18}
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

        {!!location.remark && (
          <ListItemGroup
            paddingVertical={0}
            paddingHorizontal="$3"
            backgroundColor="transparent"
            title={t('brand_location.profile.remark')}
          >
            <RegularText>{location.remark.trim()}</RegularText>
          </ListItemGroup>
        )}

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
      </FormView>
    </PageView>
  );
};
