import {
  FormView,
  LoadingView,
  PageView,
  PickerItem,
  PickerOnChange,
  SelectPicker,
  Spinner,
} from '@symbiot-core-apps/ui';
import { useCallback, useEffect, useMemo } from 'react';
import {
  DateHelper,
  DeviceInfo,
  useI18n,
  Weekday,
} from '@symbiot-core-apps/shared';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { DeviceType } from 'expo-device';

const supportPortraitNumberOfDays = DeviceInfo.deviceType === DeviceType.PHONE;
const numberOfDaysLandscapeLabel = supportPortraitNumberOfDays
  ? 'shared.preferences.calendar.number_of_days.landscape_label'
  : 'shared.preferences.calendar.number_of_days.label';

export const Calendar = () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  const { me, updatePreferences$, updating } = useCurrentAccountUpdater();

  const weekdaysOptions = useMemo(() => DateHelper.getWeekdays(), []);

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
    <PageView scrollable withHeaderHeight>
      {!me?.preferences ? (
        <LoadingView />
      ) : (
        <FormView>
          <SelectPicker
            label={t('shared.preferences.calendar.week_starts_on.label')}
            sheetLabel={t('shared.preferences.calendar.week_starts_on.label')}
            value={me.preferences.appearance?.calendar?.weekStartsOn || 0}
            options={weekdaysOptions}
            onChange={onChangeWeekdayStartsOn as PickerOnChange}
          />

          {supportPortraitNumberOfDays && (
            <SelectPicker
              label={t(
                'shared.preferences.calendar.number_of_days.portrait_label',
              )}
              sheetLabel={t(
                'shared.preferences.calendar.number_of_days.portrait_label',
              )}
              value={
                me.preferences.appearance?.calendar?.countDays?.portrait || null
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

          <SelectPicker
            label={t(numberOfDaysLandscapeLabel)}
            sheetLabel={t(numberOfDaysLandscapeLabel)}
            value={
              me.preferences.appearance?.calendar?.countDays?.landscape || null
            }
            options={
              t('shared.preferences.calendar.number_of_days.options', {
                returnObjects: true,
              }) as PickerItem[]
            }
            onChange={(value) =>
              onChangeNumberOfDays(value as number, 'landscape')
            }
          />
        </FormView>
      )}
    </PageView>
  );
};
