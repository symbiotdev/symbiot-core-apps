import { ScrollView, View, ViewStyle, XStackProps } from 'tamagui';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import {
  AttentionView,
  Avatar,
  defaultIconSize,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
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
import { DrawerActions } from '@react-navigation/native';
import { emitHaptic, useShareApp } from '@symbiot-core-apps/shared';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Icons } from '../../icons/config';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useT } from '@symbiot-core-apps/i18n';

export const drawerMenuMaxWidth = 250;
export const drawerMenuMinWidth = 68;

const MenuItem = memo(
  ({
    navigation,
    icon,
    label,
    route,
    attention,
    initial,
    ...xStackProps
  }: XStackProps & {
    navigation: DrawerNavigationHelpers;
    icon: IconName | ReactElement;
    label: string;
    route: string;
    attention?: boolean;
    initial?: boolean;
  }) => {
    const pathname = usePathname();
    const { permanent } = useDrawer();
    const { compressed } = useDrawerState();

    const focused = pathname === route || (pathname === '/' && initial);

    const onPress = useCallback(() => {
      navigation.dispatch(DrawerActions.closeDrawer());

      if (router.canDismiss()) {
        router.dismissAll();
      }

      router.replace(route);
    }, [route]);

    return (
      <ListItem
        borderRadius="$10"
        numberOfLines={1}
        paddingHorizontal={defaultPageHorizontalPadding}
        marginHorizontal={defaultPageHorizontalPadding / 2}
        backgroundColor={focused ? '$background' : 'transparent'}
        label={!permanent || !compressed ? label : ''}
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

const Br = memo((props: ViewStyle) => (
  <View
    height={2}
    backgroundColor="$background"
    marginHorizontal={defaultPageHorizontalPadding}
    {...props}
  />
));

export const DrawerMenu = (props: DrawerContentComponentProps) => {
  const { t } = useT();
  const { permanent } = useDrawer();
  const { stats } = useCurrentAccount();
  const share = useShareApp();
  const { top, bottom, left } = useSafeAreaInsets();
  const { compressed, toggleCompressed } = useDrawerState();
  const { brand: currentBrand } = useCurrentBrandState();

  const animatedStyle = useAnimatedStyle(
    () => ({
      width: withTiming(
        permanent && compressed ? drawerMenuMinWidth : drawerMenuMaxWidth,
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
          flex: 1,
          paddingTop: top + defaultPageVerticalPadding,
          paddingBottom: bottom + defaultPageVerticalPadding,
          paddingLeft: left,
        },
      ]}
    >
      <NavigationBackground
        borderRightWidth={1}
        borderRightColor="$background1"
      />

      {permanent && (
        <View
          marginLeft={
            defaultPageHorizontalPadding + defaultPageHorizontalPadding / 2
          }
          cursor="pointer"
          width={defaultIconSize}
          height={defaultIconSize}
          justifyContent="center"
          alignItems="center"
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
        style={{ marginTop: defaultPageVerticalPadding }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flex: 1,
          gap: 10,
          paddingTop: defaultPageVerticalPadding,
        }}
      >
        {currentBrand && (
          <MenuItem
            navigation={props.navigation}
            route="/branding"
            label={currentBrand.name}
            icon={
              <View>
                <Avatar
                  size={defaultIconSize}
                  name={currentBrand.name}
                  color={currentBrand.avatarColor}
                  url={currentBrand.avatarXsUrl}
                />
              </View>
            }
          />
        )}

        <Br />

        <MenuItem
          navigation={props.navigation}
          route="/notifications"
          label={t('navigation.drawer.notifications.label', { ns: 'app' })}
          attention={!!stats.newNotifications}
          icon={Icons.Notifications}
        />

        {!currentBrand ? (
          <MenuItem
            initial
            route="/actions"
            navigation={props.navigation}
            label={t('navigation.drawer.actions.label', { ns: 'app' })}
            icon={Icons.Workspace}
          />
        ) : (
          <>
            <MenuItem
              initial
              route="/home"
              navigation={props.navigation}
              label={t('navigation.drawer.home.label', { ns: 'app' })}
              icon={Icons.Home}
            />

            <MenuItem
              route="/calendar"
              navigation={props.navigation}
              label={t('navigation.drawer.calendar.label', { ns: 'app' })}
              icon={Icons.Calendar}
            />
          </>
        )}

        <Br marginTop="auto" />

        <MenuItem
          navigation={props.navigation}
          icon="Share"
          label={t('navigation.drawer.share.label', { ns: 'app' })}
          route=""
          onPress={share}
        />

        <MenuItem
          navigation={props.navigation}
          icon="FileText"
          label={t('navigation.drawer.terms_privacy.label', { ns: 'app' })}
          route="/terms-privacy"
        />

        <MenuItem
          navigation={props.navigation}
          icon="QuestionCircle"
          label={t('navigation.drawer.faq.label', { ns: 'app' })}
          route="/help-feedback"
        />

        <MenuItem
          navigation={props.navigation}
          icon="ShareCircle"
          label={t('navigation.drawer.follow_us.label', { ns: 'app' })}
          route="/follow-us"
        />

        <Br />

        <MenuItem
          navigation={props.navigation}
          icon={Icons.More}
          label={t('navigation.drawer.more.label', { ns: 'app' })}
          route="/more"
        />
      </ScrollView>
    </Animated.View>
  );
};
