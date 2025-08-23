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
import { emitHaptic, useShareApp } from '@symbiot-core-apps/shared';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';

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
      navigation.closeDrawer();

      if (!focused) {
        router.replace(route);
      }
    }, [focused, route]);

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
  const { t } = useTranslation();
  const { icons } = useApp();
  const share = useShareApp();
  const { permanent } = useDrawer();
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
        }}
      >
        {currentBrand && (
          <>
            <MenuItem
              navigation={props.navigation}
              route="/brand"
              label={currentBrand.name}
              icon={
                <View marginHorizontal={-5}>
                  <Avatar
                    size={defaultIconSize + 10}
                    name={currentBrand.name}
                    color={currentBrand.avatarColor}
                    url={currentBrand.avatarXsUrl}
                  />
                </View>
              }
            />

            <Br />
          </>
        )}

        {!currentBrand ? (
          <MenuItem
            initial
            route="/brand"
            navigation={props.navigation}
            label={t('navigation.drawer.actions.label')}
            icon={icons.Workspace}
          />
        ) : (
          <>
            <MenuItem
              initial
              route="/home"
              navigation={props.navigation}
              label={t('navigation.drawer.home.label')}
              icon={icons.Home}
            />

            <MenuItem
              route="/calendar"
              navigation={props.navigation}
              label={t('navigation.drawer.calendar.label')}
              icon={icons.Calendar}
            />
          </>
        )}

        <Br marginTop="auto" />

        <MenuItem
          navigation={props.navigation}
          icon="Share"
          label={t('navigation.drawer.share.label')}
          route=""
          onPress={share}
        />

        <MenuItem
          navigation={props.navigation}
          icon="FileText"
          label={t('navigation.drawer.terms_privacy.label')}
          route="/app/terms-privacy"
        />

        <MenuItem
          navigation={props.navigation}
          icon="QuestionCircle"
          label={t('navigation.drawer.faq.label')}
          route="/app/help-feedback"
        />

        <MenuItem
          navigation={props.navigation}
          icon="ShareCircle"
          label={t('navigation.drawer.follow_us.label')}
          route="/app/follow-us"
        />

        <Br />

        <MenuItem
          navigation={props.navigation}
          icon={icons.More}
          label={t('navigation.drawer.more.label')}
          route="/app"
        />
      </ScrollView>
    </Animated.View>
  );
};
