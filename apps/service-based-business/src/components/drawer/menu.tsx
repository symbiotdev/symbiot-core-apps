import { ScrollView, View, ViewStyle, XStack, XStackProps } from 'tamagui';
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
import { memo, useCallback } from 'react';
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
import { AdaptiveLogo } from '../auth/adaptive-logo';

export const drawerMenuMaxWidth = 250;
export const drawerMenuMinWidth = 80;

const MenuItem = memo(
  ({
    navigation,
    iconName,
    label,
    route,
    attention,
    initial,
    ...xStackProps
  }: XStackProps & {
    navigation: DrawerNavigationHelpers;
    iconName: IconName;
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
        justifyContent="center"
        borderRadius="$10"
        numberOfLines={1}
        paddingHorizontal={defaultPageHorizontalPadding}
        marginHorizontal={defaultPageHorizontalPadding / 2}
        backgroundColor={focused ? '$background' : 'transparent'}
        label={!permanent || !compressed ? label : ''}
        icon={
          <AttentionView attention={Boolean(attention)}>
            <Icon name={iconName} />
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
  const { me } = useCurrentAccount();
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

  const openProfile = useCallback(
    () => router.replace('/preferences/account'),
    [],
  );

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
      <NavigationBackground />

      {permanent && (
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingRight={defaultPageHorizontalPadding}
          paddingLeft={
            defaultPageHorizontalPadding + defaultPageHorizontalPadding / 2
          }
        >
          {!compressed && <AdaptiveLogo size={defaultIconSize} />}

          <View
            margin={compressed ? 'auto' : undefined}
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
        </XStack>
      )}

      <ScrollView contentContainerStyle={{ flex: 1, gap: 10 }}>
        {me && (
          <ListItem
            marginTop={24}
            numberOfLines={1}
            justifyContent="center"
            paddingHorizontal={
              defaultPageHorizontalPadding + defaultPageHorizontalPadding / 2
            }
            icon={
              <View>
                <Avatar
                  name={me.name}
                  size={defaultIconSize}
                  color={me.avatarColor}
                  url={me.avatarXsUrl}
                />
              </View>
            }
            label={!permanent || !compressed ? me.name : ''}
            onPress={openProfile}
          />
        )}

        <Br />

        <MenuItem
          navigation={props.navigation}
          iconName={Icons.Notifications}
          label={t('navigation.drawer.notifications.label', { ns: 'app' })}
          route="/notifications"
          attention={!!stats.newNotifications}
        />

        {!currentBrand ? (
          <MenuItem
            initial
            navigation={props.navigation}
            iconName={Icons.Workspace}
            label={t('navigation.drawer.actions.label', { ns: 'app' })}
            route="/actions"
          />
        ) : (
          <>
            <MenuItem
              initial
              navigation={props.navigation}
              iconName={Icons.Home}
              label={t('navigation.drawer.home.label', { ns: 'app' })}
              route="/home"
            />

            <MenuItem
              navigation={props.navigation}
              iconName={Icons.Calendar}
              label={t('navigation.drawer.calendar.label', { ns: 'app' })}
              route="/calendar"
            />

            <MenuItem
              navigation={props.navigation}
              iconName={Icons.Workspace}
              label={t('navigation.drawer.brands.label', { ns: 'app' })}
              route="/brands"
            />
          </>
        )}

        <Br marginTop="auto" />

        <MenuItem
          navigation={props.navigation}
          iconName="Share"
          label={t('navigation.drawer.share.label', { ns: 'app' })}
          route=""
          onPress={share}
        />

        <MenuItem
          navigation={props.navigation}
          iconName="FileText"
          label={t('navigation.drawer.terms_privacy.label', { ns: 'app' })}
          route="/terms-privacy"
        />

        <MenuItem
          navigation={props.navigation}
          iconName="QuestionCircle"
          label={t('navigation.drawer.faq.label', { ns: 'app' })}
          route="/help-feedback"
        />

        <MenuItem
          navigation={props.navigation}
          iconName="ShareCircle"
          label={t('navigation.drawer.follow_us.label', { ns: 'app' })}
          route="/follow-us"
        />

        <Br />

        <MenuItem
          navigation={props.navigation}
          iconName={Icons.Preferences}
          label={t('navigation.drawer.preferences.label', { ns: 'app' })}
          route="/preferences"
        />
      </ScrollView>
    </Animated.View>
  );
};
