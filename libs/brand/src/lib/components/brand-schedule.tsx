import { Schedule } from '@symbiot-core-apps/api';
import {
  ListItemGroup,
  RegularText,
  SemiBoldText,
  WeekdaySchedule,
} from '@symbiot-core-apps/ui';
import { DateHelper, useI18n, useNativeNow } from '@symbiot-core-apps/shared';
import { View, XStack } from 'tamagui';
import React from 'react';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

const startOfDay = DateHelper.startOfDay(new Date());

export const BrandSchedule = ({
  label,
  schedules,
}: {
  label?: string;
  schedules: Schedule[];
}) => {
  const { t } = useI18n();
  const { me } = useCurrentAccountState();
  const { now } = useNativeNow();

  return schedules.length ? (
    <ListItemGroup
      title={label || t('shared.schedule.working_hours')}
      paddingVertical="$4"
      gap="$2"
    >
      {DateHelper.getWeekdays({
        weekStartsOn: me?.preferences?.weekStartsOn,
      })
        .map((weekday) => ({
          ...weekday,
          schedule: schedules.find(
            ({ day }) => day === weekday.value,
          ) as WeekdaySchedule,
        }))
        .filter(({ schedule }) => !!schedule)
        .map(({ label, schedule: { start, end, day } }) => {
          const isDayOff = DateHelper.isDayOff(start, end);
          const Text = now.getDay() === day ? SemiBoldText : RegularText;

          return (
            <XStack
              key={day}
              opacity={isDayOff ? 0.5 : 1}
              alignItems="center"
              gap="$3"
              flexWrap="wrap"
            >
              <View
                width={5}
                height={5}
                borderRadius="$10"
                backgroundColor="$link"
              />

              <Text>{label}</Text>
              <Text marginLeft="auto">
                {isDayOff
                  ? t('shared.schedule.day_off')
                  : DateHelper.isAllDay(start, end)
                    ? t('shared.schedule.all_day')
                    : `${DateHelper.format(
                        DateHelper.addMinutes(startOfDay, start),
                        'p',
                      )} - ${DateHelper.format(
                        DateHelper.addMinutes(startOfDay, end),
                        'p',
                      )}`}
              </Text>
            </XStack>
          );
        })}
    </ListItemGroup>
  ) : (
    <ListItemGroup
      paddingVertical={0}
      paddingHorizontal="$3"
      backgroundColor="transparent"
      title={t('shared.schedule.working_hours')}
    >
      <RegularText>{t('shared.not_specified')}</RegularText>
    </ListItemGroup>
  );
};
