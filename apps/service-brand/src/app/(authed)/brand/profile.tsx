import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import React, { useLayoutEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { CurrentBrandProfile } from '@symbiot-core-apps/brand';
import { HeaderButton, useSideMenu } from '@symbiot-core-apps/ui2';

export default () => {
  const { visible: sideMenuVisible } = useSideMenu();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      ...(hasPermission('brand') && {
        headerRight: () => (
          <>
            {/*todo - analytics*/}
            {/*{!drawerVisible && hasPermission('analytics') && (*/}
            {/*  <HeaderButton*/}
            {/*    iconName="ChartSquare"*/}
            {/*    onPress={() => router.push(`/brand/analytics`)}*/}
            {/*  />*/}
            {/*)}*/}

            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/brand/update`)}
            />
          </>
        ),
      }),
    });
  }, [sideMenuVisible, hasPermission, navigation]);

  return <CurrentBrandProfile />;
};
