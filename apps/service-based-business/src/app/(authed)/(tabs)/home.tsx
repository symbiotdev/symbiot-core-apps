import {
  H2,
  H3,
  HeaderButton,
  headerButtonSize,
  PageView,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccount,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { View } from 'tamagui';
import { InitialAction } from '../../../components/brand/initial-action';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { icons } = useApp();
  const { t } = useTranslation();
  const { me, stats } = useCurrentAccount();
  const { currentEmployee } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        me?.firstname && (
          <H3 lineHeight={headerButtonSize} numberOfLines={1}>
            {t('shared.greeting_firstname', {
              firstname: me.firstname,
            })}
          </H3>
        ),
      headerRight: () => (
        <HeaderButton
          attention={!!stats.newNotifications}
          iconName={icons.Notifications}
          onPress={() => router.push('/notifications')}
        />
      ),
    });
  }, [
    icons.Notifications,
    me?.firstname,
    navigation,
    stats.newNotifications,
    t,
  ]);

  if (!currentBrand) {
    return <InitialAction />;
  }

  return (
    currentEmployee && (
      <PageView>
        <View gap={20} margin="auto">
          <H2 textAlign="center">{currentEmployee.name}</H2>
        </View>
      </PageView>
    )
  );
};
