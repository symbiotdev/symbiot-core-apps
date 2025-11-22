import { BrandEmployee } from '@symbiot-core-apps/api';
import {
  Avatar,
  ButtonIcon,
  Card,
  FormView,
  H3,
  Icon,
  ListItemGroup,
  MapsTrigger,
  MediumText,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import React, { useMemo } from 'react';
import { View, XStack } from 'tamagui';
import { DateHelper } from '@symbiot-core-apps/shared';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { openBrowserAsync } from 'expo-web-browser';
import { BrandLocationItem, BrandSchedule } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';
import { Linking } from 'react-native';
import { BrandEmployeeCongrats } from './brand-employee-congrats';
import { BrandEmployeeProfileCompletion } from './brand-employee-profile-completion';

export const BrandEmployeeProfile = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { me } = useCurrentAccountState();
  const { brand } = useCurrentBrandState();
  const { hasPermission } = useCurrentBrandEmployee();
  const { t } = useTranslation();

  const { instagram, email, phone, address } = useMemo(
    () => ({
      instagram: employee.instagrams?.[0],
      email: employee.emails?.[0],
      phone: employee.phones?.[0],
      address: employee.addresses?.[0],
    }),
    [employee.instagrams, employee.emails, employee.phones, employee.addresses],
  );

  const subtitle = useMemo(
    () =>
      [
        employee.birthday
          ? DateHelper.format(employee.birthday, me?.preferences?.dateFormat)
          : '',
        employee.gender?.label,
      ]
        .filter(Boolean)
        .join(' · '),
    [employee.birthday, employee.gender?.label, me?.preferences?.dateFormat],
  );

  const schedules = useMemo(
    () =>
      employee.schedules?.length
        ? employee.schedules
        : employee.locations?.[0]?.schedules,
    [employee.locations, employee.schedules],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView alignItems="center" gap="$5" flex={1}>
        <BrandEmployeeCongrats employee={employee} />

        {!employee.provider && (
          <Card width="100%" flexDirection="row" alignItems="center" gap="$3">
            <Icon name="InfoCircle" color="$error" />
            <RegularText color="$error">
              {t('brand_employee.profile.not_provider')}
            </RegularText>
          </Card>
        )}

        <View gap="$3" alignItems="center">
          <Avatar
            name={employee.name}
            size={100}
            url={employee.avatar?.xsUrl}
            color={employee.avatarColor}
          />

          <H3 textAlign="center">{employee.name}</H3>

          {!!subtitle && (
            <RegularText color="$placeholderColor" textAlign="center">
              {subtitle}
            </RegularText>
          )}

          <MediumText color="$placeholderColor" textAlign="center">
            {employee.role}
          </MediumText>

          <XStack justifyContent="center" gap="$2">
            <ButtonIcon
              iconName="Phone"
              disabled={!phone}
              size={40}
              iconSize={20}
              iconStyle={{ marginLeft: -2, marginBottom: -2 }}
              onPress={() => Linking.openURL(`tel:${phone}`)}
            />
            <ButtonIcon
              iconName="Letter"
              disabled={!email}
              size={40}
              iconSize={20}
              onPress={() => Linking.openURL(`mailto:${email}`)}
            />

            <MapsTrigger
              address={address}
              disabled={!address}
              trigger={
                <ButtonIcon iconName="MapPoint" size={40} iconSize={20} />
              }
            />

            {!!instagram && (
              <ButtonIcon
                iconName="Instagram"
                size={40}
                iconSize={20}
                onPress={() => openBrowserAsync(instagram)}
              />
            )}
          </XStack>
        </View>

        {hasPermission('employees') && (
          <BrandEmployeeProfileCompletion employee={employee} />
        )}

        <BrandSchedule schedules={schedules} />

        {employee.locations?.length ? (
          <ListItemGroup
            paddingVertical="$4"
            gap="$3"
            title={t('brand_employee.profile.locations')}
          >
            {employee.locations.map((location) => (
              <BrandLocationItem
                key={location.id}
                location={location}
                brand={brand}
                onPress={() => router.push(`/locations/${location.id}/profile`)}
              />
            ))}
          </ListItemGroup>
        ) : (
          <ListItemGroup
            paddingVertical={0}
            paddingHorizontal="$3"
            backgroundColor="transparent"
            title={t('brand_employee.profile.locations')}
          >
            <RegularText>
              {t('brand_employee.profile.dynamic_location')}
            </RegularText>
          </ListItemGroup>
        )}

        <ListItemGroup
          title={t('shared.about')}
          paddingVertical={0}
          paddingHorizontal="$3"
          backgroundColor="transparent"
        >
          <RegularText lineHeight={22}>
            {employee.about?.trim() || t('shared.not_specified')}
          </RegularText>
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
