import {
  AnimatedList,
  AttentionView,
  Avatar,
  CompactView,
  InitView,
  PageView,
  RegularText,
  SemiBoldText,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccountPreferences,
  useCurrentAccountState,
} from '@symbiot-core-apps/state';
import { useCallback, useEffect } from 'react';
import {
  Notification,
  useNotificationsListReq,
  useNotificationsReadReq,
} from '@symbiot-core-apps/api';
import { View, XStack } from 'tamagui';
import { DateHelper, emitHaptic } from '@symbiot-core-apps/shared';

export const Notifications = ({
  onPressNotification,
}: {
  onPressNotification: (notification: Notification) => void;
}) => {
  const { setMyStats } = useCurrentAccountState();
  const preferences = useCurrentAccountPreferences();
  const headerHeight = useScreenHeaderHeight();
  const { mutateAsync: readAll } = useNotificationsReadReq();
  const {
    items: notifications,
    isFetchingNextPage,
    isManualRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useNotificationsListReq();

  const markAllNotificationsAsRead = useCallback(async () => {
    await readAll();

    setMyStats({
      newNotifications: 0,
    });
  }, [setMyStats, readAll]);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => {
      return (
        <CompactView
          backgroundColor="$background1"
          borderRadius="$10"
          padding="$4"
          gap="$4"
          cursor="pointer"
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
            url={item.from.avatar?.xsUrl}
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
                  {DateHelper.format(item.cAt, preferences.dateFormat)}
                </RegularText>
              </AttentionView>
            </XStack>

            <SemiBoldText numberOfLines={1}>{item.title}</SemiBoldText>

            <RegularText color="$placeholderColor" numberOfLines={3}>
              {item.subtitle}
            </RegularText>
          </View>
        </CompactView>
      );
    },
    [preferences.dateFormat, onPressNotification],
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
          refreshing={isManualRefetching}
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
