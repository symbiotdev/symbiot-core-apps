import { useCallback, useEffect, useRef, useState } from 'react';
import { TimeGridRef } from '@symbiot.dev/react-native-timegrid-pro';
import { useNavigation } from 'expo-router';
import { useMe } from '@symbiot-core-apps/state';
import {
  DateHelper,
  emitHaptic,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { AppLanguage, useT } from '@symbiot-core-apps/i18n';
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

export default () => {
  const timeGridRef = useRef<TimeGridRef>(null);
  const navigation = useNavigation();
  const { me } = useMe();
  const { now } = useNativeNow();
  const { lang, t } = useT();
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
      <XStack>
        <H3 lineHeight={headerButtonSize} textTransform="capitalize">
          {DateHelper.format(selectedDate, 'LLLL yyyy', lang as AppLanguage)}
        </H3>
      </XStack>
    ),
    [lang, selectedDate],
  );

  const renderHeaderSafeArea = useCallback(() => {
    return (
      <View flex={1} justifyContent="center" alignItems="center" gap="$1">
        <RegularText fontSize={10}>{t('schedule.all_day')}</RegularText>
        {/*<RegularText fontSize={10}>09:00</RegularText>*/}
        {/*<RegularText fontSize={10}>18:00</RegularText>*/}
      </View>
    );
  }, [t]);

  const headerRight = useCallback(
    () =>
      me && (
        <XStack gap="$3">
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

          <Avatar
            name={me.name}
            size={headerButtonSize}
            url={me.avatarXsUrl}
            color={me.avatarColor}
          />
        </XStack>
      ),
    [me, now, goToday],
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft,
      headerRight,
    });
  }, [headerLeft, headerRight, navigation]);

  return (
    <View flex={1} paddingTop={headerHeight} alignItems="center">
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
