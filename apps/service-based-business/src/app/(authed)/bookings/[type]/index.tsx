import { BrandBookingsList } from '@symbiot-core-apps/brand-booking';
import { useTranslation } from 'react-i18next';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandBookingType,
  getTranslateKeyByBrandBookingType,
} from '@symbiot-core-apps/api';
import React, { useLayoutEffect } from 'react';
import {
  Button,
  EmptyView,
  HeaderButton,
  InitView,
  PageView,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { useApp } from '@symbiot-core-apps/app';

export default () => {
  const { t } = useTranslation();
  const headerHeight = useScreenHeaderHeight();
  const navigation = useNavigation();
  const { type } = useLocalSearchParams<{
    type: BrandBookingType;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`${getTranslateKeyByBrandBookingType(type)}.title`),
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={() => router.push(`/bookings/${type}/create`)}
        />
      ),
    });
  }, [type, navigation, t]);

  return (
    <BrandBookingsList offsetTop={headerHeight} type={type} Intro={Intro} />
  );
};

const Intro = ({
  loading,
  error,
}: {
  loading?: boolean;
  error?: string | null;
}) => {
  const { icons } = useApp();
  const { t } = useTranslation();
  const { type } = useLocalSearchParams<{
    type: BrandBookingType;
  }>();

  const tPrefix = `${getTranslateKeyByBrandBookingType(type)}.create.intro`;

  if (loading || error) {
    return <InitView loading={loading} error={error} />;
  } else {
    return (
      <PageView
        scrollable
        animation="medium"
        opacity={1}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      >
        <EmptyView
          padding={0}
          iconName={
            type === BrandBookingType.unavailable
              ? icons.UnavailableBooking
              : icons.ServiceBooking
          }
          title={t(`${tPrefix}.title`)}
          message={t(`${tPrefix}.subtitle`)}
        >
          <Button
            label={t(`${tPrefix}.button.label`)}
            onPress={() => router.push(`/bookings/${type}/create`)}
          />
        </EmptyView>
      </PageView>
    );
  }
};
