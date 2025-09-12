import { ScrollView, View, XStackProps } from 'tamagui';
import {
  AttentionView,
  Avatar,
  Br,
  defaultIconSize,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  Icon,
  IconName,
  ListItem,
  NavigationBackground,
  useDrawer,
  useDrawerState,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { memo, ReactElement, useCallback } from 'react';
import { emitHaptic, useShareApp } from '@symbiot-core-apps/shared';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';

export const drawerMenuMaxWidth = 250;
export const drawerMenuMinWidth = 68;

const MenuItem = memo(
  ({
    icon,
    label,
    route,
    additionalRoutes,
    attention,
    ...xStackProps
  }: XStackProps & {
    icon: IconName | ReactElement;
    label: string;
    route: string;
    additionalRoutes?: string[];
    attention?: boolean;
  }) => {
    const pathname = usePathname();

    const focused =
      pathname === route ||
      pathname === '/' ||
      additionalRoutes?.some(
        (additionalRoute) => additionalRoute.indexOf(pathname) !== -1,
      );

    const onPress = useCallback(() => {
      if (!focused) {
        if (router.canDismiss()) {
          router.dismissAll();
        }

        router.replace(route);
      }
    }, [focused, route]);

    return (
      <ListItem
        borderRadius="$10"
        labelNumberOfLines={1}
        paddingHorizontal={defaultPageHorizontalPadding}
        marginHorizontal={defaultPageHorizontalPadding / 2}
        backgroundColor={focused ? '$background' : 'transparent'}
        label={label}
        icon={
          <AttentionView attention={Boolean(attention)}>
            {typeof icon === 'string' ? <Icon name={icon} /> : icon}
          </AttentionView>
        }
        onPress={onPress}
        {...xStackProps}
      />
    );
  },
);

export const DrawerMenu = () => {
  const { t } = useTranslation();
  const { icons } = useApp();
  const share = useShareApp();
  const { permanent } = useDrawer();
  const headerHeight = useScreenHeaderHeight();
  const { top, bottom, left } = useSafeAreaInsets();
  const { compressed, toggleCompressed } = useDrawerState();
  const { brand: currentBrand } = useCurrentBrandState();
  const { hasPermission } = useCurrentBrandEmployee();

  const animatedStyle = useAnimatedStyle(
    () => ({
      width: withTiming(
        permanent || compressed ? drawerMenuMinWidth : drawerMenuMaxWidth,
        {
          duration: 250,
        },
      ),
    }),
    [permanent, compressed],
  );

  const toggleDrawerCompression = useCallback(() => {
    emitHaptic();
    toggleCompressed();
  }, [toggleCompressed]);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          paddingTop: top,
          paddingBottom: bottom + defaultPageVerticalPadding,
          paddingLeft: left,
        },
      ]}
    >
      <NavigationBackground
        borderRightWidth={1}
        borderRightColor="$background1"
      />

      {!permanent && (
        <View
          cursor="pointer"
          width={68}
          height={headerHeight}
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: 0.8 }}
          onPress={toggleDrawerCompression}
        >
          <Icon
            name={compressed ? 'Maximize' : 'Minimize'}
            size={18}
            color="$buttonTextColor1"
          />
        </View>
      )}

      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 10,
        }}
      >
        {currentBrand && (
          <View>
            <MenuItem
              route="/my-brand"
              additionalRoutes={['/brand/create']}
              label={currentBrand.name}
              icon={
                <Avatar
                  marginHorizontal={-4}
                  size={defaultIconSize + 8}
                  name={currentBrand.name}
                  color={currentBrand.avatarColor}
                  url={currentBrand.avatarXsUrl}
                />
              }
            />

            <Br marginHorizontal={defaultPageHorizontalPadding} />
          </View>
        )}

        <MenuItem
          route="/home"
          label={t(
            !currentBrand
              ? 'navigation.drawer.actions.label'
              : 'navigation.drawer.home.label',
          )}
          icon={icons.Home}
        />

        {!!currentBrand && (
          <MenuItem
            route="/schedule"
            label={t('navigation.drawer.calendar.label')}
            icon={icons.Calendar}
          />
        )}

        <Br marginHorizontal={defaultPageHorizontalPadding} />

        {hasPermission('locationsAll') && (
          <MenuItem
            route="/locations"
            label={t('navigation.drawer.locations.label')}
            icon="MapPointWave"
            additionalRoutes={['/locations/create']}
          />
        )}

        {hasPermission('employeesAll') && (
          <MenuItem
            route="/employees"
            label={t('navigation.drawer.employees.label')}
            icon="UsersGroupRounded"
            additionalRoutes={['/employees/create']}
          />
        )}

        {hasPermission('clientsAll') && (
          <MenuItem
            route="/clients"
            label={t('navigation.drawer.clients.label')}
            icon="SmileCircle"
            additionalRoutes={['/clients/create']}
          />
        )}

        <Br marginTop="auto" marginHorizontal={defaultPageHorizontalPadding} />

        <MenuItem
          icon="Share"
          label={t('navigation.drawer.share.label')}
          route=""
          onPress={share}
        />

        <MenuItem
          icon="FileText"
          label={t('navigation.drawer.terms_privacy.label')}
          route="/terms-privacy"
        />

        <MenuItem
          icon="QuestionCircle"
          label={t('navigation.drawer.faq.label')}
          route="/help-feedback"
        />

        <MenuItem
          icon="ShareCircle"
          label={t('navigation.drawer.follow_us.label')}
          route="/follow-us"
        />

        <Br marginHorizontal={defaultPageHorizontalPadding} />

        <MenuItem
          icon={icons.More}
          label={t('navigation.drawer.more.label')}
          route="/menu"
        />
      </ScrollView>
    </Animated.View>
  );
};
