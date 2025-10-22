import { BrandEmployee } from '@symbiot-core-apps/api';
import {
  Avatar,
  FormView,
  getNicknameFromUrl,
  H3,
  Link,
  ListItemGroup,
  PageView,
  RegularText,
  SemiBoldText,
  SocialIcon,
  WeekdaySchedule,
} from '@symbiot-core-apps/ui';
import { useCallback, useMemo } from 'react';
import { View, XStack } from 'tamagui';
import {
  DateHelper,
  emitHaptic,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { openBrowserAsync } from 'expo-web-browser';

const startOfDay = DateHelper.startOfDay(new Date());

export const BrandEmployeeProfile = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { me } = useCurrentAccountState();
  const { t } = useTranslation();
  const { now } = useNativeNow();

  const instagram = useMemo(
    () => employee.instagrams?.[0],
    [employee.instagrams],
  );

  const schedules = useMemo(
    () =>
      employee.schedules?.length
        ? employee.schedules
        : employee.locations?.[0]?.schedules,
    [employee.locations, employee.schedules],
  );

  const onInstagramPress = useCallback(() => {
    if (!instagram) return;

    emitHaptic();

    void openBrowserAsync(instagram);
  }, [instagram]);

  return (
    <PageView scrollable withHeaderHeight>
      <FormView alignItems="center" gap="$5">
        <View gap="$3" alignItems="center">
          <Avatar
            name={employee.name}
            size={100}
            url={employee.avatar?.xsUrl}
            color={employee.avatarColor}
          />

          <H3 textAlign="center">{employee.name}</H3>

          <RegularText color="$placeholderColor" textAlign="center">
            {employee.role}
          </RegularText>

          {!!instagram && (
            <XStack justifyContent="center" gap="$2" flex={1} maxWidth="80%">
              <SocialIcon name="Instagram" size={18} color="$link" />
              <Link
                onPress={onInstagramPress}
                lineHeight={18}
                numberOfLines={1}
              >
                {getNicknameFromUrl(instagram)}
              </Link>
            </XStack>
          )}
        </View>

        {!!employee.about && (
          <ListItemGroup
            title={t('shared.about')}
            paddingVertical="$4"
            gap="$2"
          >
            <RegularText lineHeight={22}>{employee.about}</RegularText>
          </ListItemGroup>
        )}

        {!!schedules?.length && (
          <ListItemGroup
            title={t('shared.schedule.working_hours')}
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
        )}
      </FormView>
    </PageView>
  );
};
