import { useCallback, useEffect, useRef, useState } from 'react';
import { TimeGridRef } from '@symbiot.dev/react-native-timegrid-pro';
import { useNavigation } from 'expo-router';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import {
  DateHelper,
  emitHaptic,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  Avatar,
  Calendar,
  H3,
  headerButtonSize,
  Icon,
  MediumText,
  RegularText,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

export default () => {
  const { me } = useCurrentAccountState();
  const timeGridRef = useRef<TimeGridRef>(null);
  const navigation = useNavigation();
  const { now } = useNativeNow();
  const { i18n, t } = useTranslation();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const headerHeight = useScreenHeaderHeight();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToday = useCallback(() => {
    timeGridRef.current?.toDatetime(new Date(), {
      animated: true,
    });

    emitHaptic();
  }, []);

  const headerLeft = useCallback(
    () => (
      <XStack gap="$3" alignItems="center" width="100%">
        <View
          position="relative"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          pressStyle={{ opacity: 0.8 }}
          onPress={goToday}
        >
          <Icon name="CalendarMinimalistic" color="$buttonTextColor1" />

          <MediumText
            position="absolute"
            bottom={3}
            color="$buttonTextColor1"
            fontSize={10}
            lineHeight={10}
          >
            {now.getDate()}
          </MediumText>
        </View>

        <H3 textTransform="capitalize" flex={1} numberOfLines={1}>
          {DateHelper.format(selectedDate, 'LLLL yyyy', i18n.language)}
        </H3>
      </XStack>
    ),
    [i18n.language, now, goToday, selectedDate],
  );

  const renderHeaderSafeArea = useCallback(() => {
    return (
      <View flex={1} justifyContent="center" alignItems="center" gap="$1">
        <RegularText color="$calendarTimeColor" fontSize={10}>
          {t('shared.schedule.all_day')}
        </RegularText>
        {/*<RegularText fontSize={10}>09:00</RegularText>*/}
        {/*<RegularText fontSize={10}>18:00</RegularText>*/}
      </View>
    );
  }, [t]);

  const headerRight = useCallback(
    () =>
      me ? (
        <Avatar
          name={me.name}
          size={headerButtonSize}
          url={me.avatar?.xsUrl}
          color={me.avatarColor}
        />
      ) : (
        <View />
      ),
    [me],
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft,
      headerRight,
    });
  }, [headerLeft, headerRight, navigation]);

  return (
    <View flex={1} marginTop={headerHeight}>
      <Calendar
        timeGridRef={timeGridRef}
        selectedDate={selectedDate}
        weekStartsOn={me?.preferences?.weekStartsOn}
        gridBottomOffset={Platform.OS === 'android' ? 5 : bottomTabBarHeight}
        renderHeaderSafeArea={renderHeaderSafeArea}
        onChangeDate={setSelectedDate}
      />
    </View>
  );
};
