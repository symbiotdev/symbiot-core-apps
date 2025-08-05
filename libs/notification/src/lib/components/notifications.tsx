import {
  AnimatedList,
  AttentionView,
  Avatar,
  FormView,
  InitView,
  PageView,
  RegularText,
  SemiBoldText,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { useAccountNotificationsState, useMe } from '@symbiot-core-apps/state';
import { useCallback, useEffect } from 'react';
import {
  AccountNotification,
  useAccountNotificationLoader,
  useAccountNotificationsReadQuery,
} from '@symbiot-core-apps/api';
import { View, XStack } from 'tamagui';
import { DateHelper, emitHaptic } from '@symbiot-core-apps/shared';

export const Notifications = ({
  onPressNotification,
}: {
  onPressNotification: (notification: AccountNotification) => void;
}) => {
  const { me, updateMeStats } = useMe();
  const headerHeight = useScreenHeaderHeight();
  const { mutateAsync: readAll } = useAccountNotificationsReadQuery();
  const {
    notifications: initialNotificationsState,
    setNotifications: setInitialNotificationsState,
  } = useAccountNotificationsState();
  const {
    notifications,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useAccountNotificationLoader({
    initialState: initialNotificationsState,
    setInitialState: setInitialNotificationsState,
  });

  const markAllNotificationsAsRead = useCallback(async () => {
    await readAll();

    if (me?.stats) {
      updateMeStats({
        notifications: {
          ...me.stats.notifications,
          new: 0,
        },
      });
    }
  }, [me?.stats, readAll, updateMeStats]);

  const renderItem = useCallback(
    ({ item }: { item: AccountNotification }) => {
      return (
        <FormView
          backgroundColor="$background1"
          borderRadius="$10"
          padding="$4"
          gap="$4"
          flexDirection="row"
          pressStyle={{ opacity: 0.8 }}
          onPress={() => {
            emitHaptic();
            onPressNotification(item);
          }}
        >
          <Avatar
            name={item.from.name}
            size={40}
            url={item.from.avatarXsUrl}
            color={item.from.avatarColor}
          />

          <View gap="$1" flex={1}>
            <XStack justifyContent="space-between" gap="$4">
              <RegularText color="$placeholderColor" numberOfLines={1}>
                {item.from.name}
              </RegularText>
              <AttentionView
                attention={!item.read}
                dotProps={{ right: -5, top: -5 }}
              >
                <RegularText color="$placeholderColor" numberOfLines={1}>
                  {DateHelper.format(item.cAt, me?.preferences?.dateFormat)}
                </RegularText>
              </AttentionView>
            </XStack>

            <SemiBoldText numberOfLines={1}>{item.title}</SemiBoldText>

            <RegularText color="$placeholderColor" numberOfLines={3}>
              {item.subtitle}
            </RegularText>
          </View>
        </FormView>
      );
    },
    [me?.preferences?.dateFormat, onPressNotification],
  );

  useEffect(() => {
    return () => {
      void markAllNotificationsAsRead();
    };
  }, [markAllNotificationsAsRead]);

  return (
    <PageView ignoreTopSafeArea ignoreBottomSafeArea paddingBottom={0}>
      {!notifications?.length ? (
        <InitView loading={isLoading} error={error} />
      ) : (
        <AnimatedList
          refreshing={isRefetching && !isLoading}
          expanding={isFetchingNextPage}
          data={notifications}
          progressViewOffset={headerHeight}
          contentContainerStyle={{
            gap: 2,
            paddingTop: headerHeight,
            paddingBottom: 100,
          }}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
        />
      )}
    </PageView>
  );
};
