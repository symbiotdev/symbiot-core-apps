import { BrandMembershipsCurrentList } from '@symbiot-core-apps/brand-membership';
import React, { useLayoutEffect } from 'react';
import {
  Button,
  EmptyView,
  HeaderButton,
  InitView,
  PageView,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { router, useNavigation } from 'expo-router';
import { useBrandPeriodBasedMembershipCurrentListQuery } from '@symbiot-core-apps/api';
import { BrandPeriodBasedMembershipItem } from '@symbiot-core-apps/brand';
import { useTranslation } from 'react-i18next';
import { useApp } from '@symbiot-core-apps/app';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={() => router.push('/memberships/create')}
        />
      ),
    });
  }, [navigation]);

  return (
    <BrandMembershipsCurrentList
      offsetTop={headerHeight}
      query={useBrandPeriodBasedMembershipCurrentListQuery}
      renderItem={({ item }) => (
        <BrandPeriodBasedMembershipItem
          membership={item}
          onPress={() => router.push(`/memberships/${item.id}/profile`)}
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
  const { t } = useTranslation();
  const { icons } = useApp();

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
          iconName={icons.Membership}
          title={t('brand_membership.create.intro.title')}
          message={t('brand_membership.create.intro.subtitle')}
        >
          <Button
            label={t('brand_membership.create.intro.button.label')}
            onPress={() => router.push('/memberships/create')}
          />
        </EmptyView>
      </PageView>
    );
  }
};
