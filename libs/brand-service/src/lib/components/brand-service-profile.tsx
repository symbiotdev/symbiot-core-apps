import { BrandService } from '@symbiot-core-apps/api';
import {
  Avatar,
  defaultPageHorizontalPadding,
  ExtraBoldText,
  FormView,
  H2,
  ListItemGroup,
  MediumText,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { useWindowDimensions } from 'react-native';
import {
  BrandEmployeeItem,
  BrandLocationItem,
  BrandServiceItemChips,
  useAllBrandLocation,
} from '@symbiot-core-apps/brand';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { router } from 'expo-router';
import { View } from 'tamagui';
import { useApp } from '@symbiot-core-apps/app';
import { formatPrice } from '@symbiot-core-apps/shared';
import React from 'react';

export const BrandServiceProfile = ({ service }: { service: BrandService }) => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const { functionality } = useApp();
  const { height } = useWindowDimensions();
  const allBrandLocation = useAllBrandLocation();

  return (
    <PageView
      scrollable
      withHeaderHeight
      paddingLeft={0}
      paddingRight={0}
      paddingTop={0}
    >
      <Avatar
        name={service.name}
        url={service.avatar?.url}
        borderRadius={0}
        color="$background1"
        size={{
          width: '100%',
          height: Math.max(height / 3, 250),
        }}
      />

      <FormView
        marginTop="$3"
        gap="$5"
        paddingHorizontal={defaultPageHorizontalPadding}
      >
        <View paddingTop="$3" gap="$3">
          <H2>{service.name}</H2>

          {service.hidden && (
            <RegularText color="$error">
              {t('brand_service.unavailable')}
            </RegularText>
          )}

          {functionality.availability.servicePrice && (
            <View gap="$1">
              {service.price ? (
                <>
                  {!!service.discount && (
                    <MediumText
                      textDecorationLine="line-through"
                      color="$placeholderColor"
                    >
                      {formatPrice({
                        price: service.price,
                        symbol: service.currency?.symbol,
                      })}
                    </MediumText>
                  )}

                  <ExtraBoldText fontSize={30}>
                    {formatPrice({
                      price: service.price,
                      discount: service.discount,
                      symbol: service.currency?.symbol,
                    })}
                  </ExtraBoldText>
                </>
              ) : (
                <RegularText>{t('brand_service.free')}</RegularText>
              )}
            </View>
          )}

          <BrandServiceItemChips
            type="highlighted"
            size="medium"
            service={service}
          />
        </View>

        {!!service.description && (
          <RegularText>{service.description}</RegularText>
        )}

        {!!service.employees?.length && (
          <ListItemGroup
            paddingVertical="$4"
            gap="$3"
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
          gap="$3"
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
            <RegularText>{allBrandLocation.label}</RegularText>
          )}
        </ListItemGroup>

        <ListItemGroup
          paddingVertical={0}
          backgroundColor="transparent"
          title={t('brand_service.profile.note')}
        >
          <RegularText lineHeight={22}>
            {service.note || t('shared.not_specified')}
          </RegularText>
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
