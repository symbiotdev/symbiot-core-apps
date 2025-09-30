import { ScrollView, View, XStackProps } from 'tamagui';
import {
  AttentionView,
  Avatar,
  Br,
  defaultIconSize,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  headerHeight,
  Icon,
  IconName,
  ListItem,
  NavigationBackground,
  useDrawer,
  useDrawerState,
} from '@symbiot-core-apps/ui';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { memo, ReactElement, useCallback } from 'react';
import { emitHaptic } from '@symbiot-core-apps/shared';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  useCurrentAccountState,
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
      if (pathname !== route) {
        if (router.canDismiss()) {
          router.dismissAll();
        }

        router.replace(route);
      }
    }, [pathname, route]);

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
  const { stats } = useCurrentAccountState();
  const { brand: currentBrand } = useCurrentBrandState();
  const { compressed, toggleCompressed } = useDrawerState();
  const { icons } = useApp();
  const { t } = useTranslation();
  const { permanent } = useDrawer();
  const { top, bottom, left } = useSafeAreaInsets();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();

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
          <>
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

            {!permanent && (
              <Br marginHorizontal={defaultPageHorizontalPadding} />
            )}
          </>
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

        <MenuItem
          attention={!!stats.newNotifications}
          route="/notifications"
          label={t('navigation.drawer.notifications.label')}
          icon={icons.Notifications}
        />

        {!!currentBrand && (
          <MenuItem
            route="/schedule"
            label={t('navigation.drawer.calendar.label')}
            icon={icons.Calendar}
          />
        )}

        {hasAnyOfPermissions([
          'analyticsAll',
          'clientsAll',
          'locationsAll',
          'employeesAll',
        ]) && <Br marginHorizontal={defaultPageHorizontalPadding} />}

        {hasPermission('analyticsAll') && (
          <MenuItem
            route="/analytics"
            label={t('navigation.drawer.analytics.label')}
            icon="ChartSquare"
          />
        )}

        {hasPermission('clientsAll') && (
          <MenuItem
            route="/clients"
            label={t('navigation.drawer.clients.label')}
            icon="SmileCircle"
            additionalRoutes={['/clients']}
          />
        )}

        {hasPermission('locationsAll') && (
          <MenuItem
            route="/locations"
            label={t('navigation.drawer.locations.label')}
            icon="MapPointWave"
            additionalRoutes={['/locations']}
          />
        )}

        {hasPermission('employeesAll') && (
          <MenuItem
            route="/employees"
            label={t('navigation.drawer.employees.label')}
            icon="UsersGroupRounded"
            additionalRoutes={['/employees']}
          />
        )}

        {hasAnyOfPermissions([
          'servicesAll',
          'membershipsAll',
          'ticketsAll',
        ]) && <Br marginHorizontal={defaultPageHorizontalPadding} />}

        {hasPermission('servicesAll') && (
          <MenuItem
            route="/services"
            label={t('navigation.drawer.services.label')}
            icon={icons.Service}
            additionalRoutes={['/services']}
          />
        )}

        {hasPermission('membershipsAll') && (
          <MenuItem
            route="/memberships"
            label={t('navigation.drawer.memberships.label')}
            icon={icons.Membership}
            additionalRoutes={['/memberships']}
          />
        )}

        {hasPermission('ticketsAll') && (
          <MenuItem
            route="/tickets"
            label={t('navigation.drawer.tickets.label')}
            icon={icons.Ticket}
            additionalRoutes={['/tickets']}
          />
        )}

        <Br marginHorizontal={defaultPageHorizontalPadding} />

        <MenuItem
          marginTop="auto"
          icon="QuestionCircle"
          label={t('navigation.drawer.faq.label')}
          route="/app/help-feedback"
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
