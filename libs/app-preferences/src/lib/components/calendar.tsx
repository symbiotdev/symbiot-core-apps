import { CompactView, Spinner } from '@symbiot-core-apps/ui';
import { useCallback, useEffect, useMemo } from 'react';
import {
  DateHelper,
  isPhone,
  useI18n,
  Weekday,
} from '@symbiot-core-apps/shared';
import {
  useCurrentAccountPreferences,
  useCurrentAccountUpdater,
} from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import {
  HorizontalMultiToggle,
  PickerItem,
  Select,
} from '@symbiot-core-apps/form-controller';
import { ScrollablePage, ToggleListOnChange } from '@symbiot-core-apps/ui2';

const numberOfDaysLandscapeLabel = isPhone
  ? 'shared.preferences.calendar.number_of_days.landscape_label'
  : 'shared.preferences.calendar.number_of_days.label';

export const Calendar = () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  const { updatePreferences$, updating } = useCurrentAccountUpdater();
  const preferences = useCurrentAccountPreferences();

  const weekdaysOptions = useMemo(() => DateHelper.getWeekdays(), []);
  const hiddenDays = useMemo(
    () =>
      DateHelper.getWeekdays({
        formatStr: 'EEEEE',
        weekStartsOn: preferences.appearance?.calendar?.weekStartsOn,
      }),
    [preferences.appearance?.calendar?.weekStartsOn],
  );

  const onChangeWeekdayStartsOn = useCallback(
    (weekStartsOn: Weekday) =>
      updatePreferences$({
        appearance: {
          calendar: {
            weekStartsOn,
          },
        },
      }),
    [updatePreferences$],
  );

  const onChangeHiddenDays = useCallback(
    (hiddenDays: Weekday[]) =>
      updatePreferences$({
        appearance: {
          calendar: {
            hiddenDays,
          },
        },
      }),
    [updatePreferences$],
  );

  const onChangeNumberOfDays = useCallback(
    (value: number | null, orientation: 'landscape' | 'portrait') =>
      updatePreferences$({
        appearance: {
          calendar: {
            countDays: {
              [orientation]: value,
            },
          },
        },
      }),
    [updatePreferences$],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: updating ? () => <Spinner /> : undefined,
    });
  }, [updating, navigation]);

  return (
    <ScrollablePage>
      <CompactView>
        <Select
          label={t('shared.preferences.calendar.week_starts_on.label')}
          value={preferences.appearance?.calendar?.weekStartsOn || 0}
          options={weekdaysOptions}
          onChange={onChangeWeekdayStartsOn as ToggleListOnChange}
        />

        {isPhone && (
          <Select
            label={t(
              'shared.preferences.calendar.number_of_days.portrait_label',
            )}
            value={
              preferences.appearance?.calendar?.countDays?.portrait || null
            }
            options={
              t('shared.preferences.calendar.number_of_days.options', {
                returnObjects: true,
              }) as PickerItem[]
            }
            onChange={(value) =>
              onChangeNumberOfDays(value as number, 'portrait')
            }
          />
        )}

        <Select
          label={t(numberOfDaysLandscapeLabel)}
          value={preferences.appearance?.calendar?.countDays?.landscape || null}
          options={
            t('shared.preferences.calendar.number_of_days.options', {
              returnObjects: true,
            }) as PickerItem[]
          }
          onChange={(value) =>
            onChangeNumberOfDays(value as number, 'landscape')
          }
        />

        <HorizontalMultiToggle
          allowEmpty
          max={6}
          label={t('shared.preferences.calendar.hidden_days.label')}
          value={preferences.appearance?.calendar?.hiddenDays}
          options={hiddenDays}
          onChange={onChangeHiddenDays as ToggleListOnChange}
        />
      </CompactView>
    </ScrollablePage>
  );
};
