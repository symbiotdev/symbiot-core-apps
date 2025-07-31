import { View, XStack } from 'tamagui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Calendar,
  H2,
  headerButtonSize,
  Icon,
  MediumText,
  RegularText,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { Platform } from 'react-native';
import { useMe } from '@symbiot-core-apps/state';
import { useNavigation } from 'expo-router';
import { DateHelper, useNativeNow } from '@symbiot-core-apps/shared';
import { useTranslation } from 'react-i18next';
import { TimeGridRef } from '@symbiot.dev/react-native-timegrid-pro';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { AppLanguage } from '@symbiot-core-apps/i18n';

export const BusinessCalendar = () => {
  const timeGridRef = useRef<TimeGridRef>(null);
  const navigation = useNavigation();
  const { me } = useMe();
  const { now } = useNativeNow();
  const { i18n, t } = useTranslation();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const headerHeight = useScreenHeaderHeight();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToday = useCallback(() => {
    timeGridRef.current?.toDatetime(new Date(), {
      animated: true,
    });

    void impactAsync(ImpactFeedbackStyle.Light);
  }, []);

  const headerLeft = useCallback(
    () => (
      <XStack>
        <H2 lineHeight={headerButtonSize} textTransform="capitalize">
          {DateHelper.format(
            selectedDate,
            'LLLL yyyy',
            i18n.language as AppLanguage,
          )}
        </H2>
      </XStack>
    ),
    [i18n.language, selectedDate],
  );

  const renderHeaderSafeArea = useCallback(() => {
    return (
      <View flex={1} justifyContent="center" alignItems="center" gap="$1">
        <RegularText fontSize={10}>{t('shared.schedule.all_day')}</RegularText>
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
