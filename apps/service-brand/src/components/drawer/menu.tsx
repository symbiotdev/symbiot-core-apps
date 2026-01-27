import { ScrollView, useTheme, View, XStackProps } from 'tamagui';
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
import { emitHaptic, useI18n } from '@symbiot-core-apps/shared';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useAppSettings } from '@symbiot-core-apps/app';
import { BrandMembershipType } from '@symbiot-core-apps/api';

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
      (pathname === '/'
        ? additionalRoutes?.includes(pathname)
        : additionalRoutes?.some(
            (additionalRoute) => additionalRoute.indexOf(pathname) !== -1,
          ));
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
            {typeof icon === 'string' ? (
              <Icon name={icon} type={focused ? 'SolarBold' : undefined} />
            ) : (
              icon
            )}
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
  const { icons } = useAppSettings();
  const { t } = useI18n();
  const { permanent } = useDrawer();
  const theme = useTheme();
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
        borderRightColor={theme?.$background1?.val}
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
              route="/brand/profile"
              additionalRoutes={['/brand/create']}
              label={currentBrand.name}
              icon={
                <Avatar
                  marginHorizontal={-4}
                  size={defaultIconSize + 8}
                  name={currentBrand.name}
                  color={currentBrand.avatarColor}
                  url={currentBrand.avatar?.xsUrl}
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
          additionalRoutes={['/']}
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

        {hasAnyOfPermissions(['clients', 'locations', 'employees']) && (
          <Br marginHorizontal={defaultPageHorizontalPadding} />
        )}

        {hasPermission('clients') && (
          <MenuItem
            route="/clients"
            label={t('navigation.drawer.clients.label')}
            icon="SmileCircle"
            additionalRoutes={['/clients']}
          />
        )}

        {hasPermission('locations') && (
          <MenuItem
            route="/locations"
            label={t('navigation.drawer.locations.label')}
            icon="MapPointWave"
            additionalRoutes={['/locations']}
          />
        )}

        {hasPermission('employees') && (
          <MenuItem
            route="/employees"
            label={t('navigation.drawer.employees.label')}
            icon="UsersGroupRounded"
            additionalRoutes={['/employees']}
          />
        )}

        {hasPermission('catalog') && (
          <>
            <Br marginHorizontal={defaultPageHorizontalPadding} />

            <MenuItem
              route="/services"
              label={t('navigation.drawer.services.label')}
              icon={icons.Service}
              additionalRoutes={['/services']}
            />
            <MenuItem
              route={`/memberships/${BrandMembershipType.visits}`}
              label={t('navigation.drawer.visit_based_memberships.label')}
              icon={icons.VisitBasedMembership}
            />
            <MenuItem
              route={`/memberships/${BrandMembershipType.period}`}
              label={t('navigation.drawer.period_based_memberships.label')}
              icon={icons.PeriodBasedMembership}
            />
          </>
        )}

        {hasAnyOfPermissions(['analytics', 'finances']) && (
          <Br marginHorizontal={defaultPageHorizontalPadding} />
        )}

        {/*todo - analytics*/}
        {/*{hasPermission('analytics') && (*/}
        {/*  <MenuItem*/}
        {/*    route="/brand/analytics"*/}
        {/*    label={t('navigation.drawer.analytics.label')}*/}
        {/*    icon="ChartSquare"*/}
        {/*  />*/}
        {/*)}*/}

        {hasPermission('finances') && (
          <MenuItem
            route="/transactions"
            label={t('navigation.drawer.transactions.label')}
            icon="Bill"
          />
        )}

        <Br marginTop="auto" marginHorizontal={defaultPageHorizontalPadding} />

        <MenuItem
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
