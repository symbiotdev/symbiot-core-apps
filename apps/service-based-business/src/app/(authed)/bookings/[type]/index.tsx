import { BrandBookingsList } from '@symbiot-core-apps/brand-booking';
import { useTranslation } from 'react-i18next';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandBookingType,
  getTranslateKeyByBrandBookingType,
  PaginationListParams,
  useBrandBookingCurrentListReq,
} from '@symbiot-core-apps/api';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  Button,
  EmptyView,
  HeaderButton,
  InitView,
  PageView,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { BrandBookingItem } from '@symbiot-core-apps/brand';
import { useApp } from '@symbiot-core-apps/app';
import { DateHelper, useNativeNow } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useTranslation();
  const { now } = useNativeNow();
  const headerHeight = useScreenHeaderHeight();
  const navigation = useNavigation();
  const { type } = useLocalSearchParams<{
    type: BrandBookingType;
  }>();

  const start = useMemo(() => DateHelper.startOfDay(now), [now]);

  const useQuery = useCallback(
    (params?: PaginationListParams) =>
      useBrandBookingCurrentListReq({ type, start, params }),
    [start, type],
  );

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
    <BrandBookingsList
      offsetTop={headerHeight}
      type={type}
      query={useQuery}
      renderItem={({ item }) => (
        <BrandBookingItem
          alignSelf="center"
          booking={item}
          onPress={() => router.push(`/bookings/${type}/${item.id}/profile`)}
        />
      )}
      Intro={Intro}
    />
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
