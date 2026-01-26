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
import { DateHelper, useI18n, Weekday } from '@symbiot-core-apps/shared';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { DateElementType } from '@symbiot-core-apps/api';

export const Datetime = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
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

  const onChangeDateFormat = useCallback(
    (dateFormat: string) => updatePreferences$({ dateFormat }),
    [updatePreferences$],
  );

  const onChangeTimeFormat = useCallback(
    (timeFormat: string) => updatePreferences$({ timeFormat }),
    [updatePreferences$],
  );

  const onChangeDateElement = useCallback(
    (element: DateElementType) =>
      updatePreferences$({
        appearance: {
          date: {
            element,
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
            label={t('shared.preferences.datetime.week_starts_on.label')}
            sheetLabel={t('shared.preferences.datetime.week_starts_on.label')}
            value={me.preferences.appearance?.calendar?.weekStartsOn || 0}
            options={weekdaysOptions}
            onChange={onChangeWeekdayStartsOn as PickerOnChange}
          />

          <SelectPicker
            label={t('shared.preferences.datetime.date_format.label')}
            sheetLabel={t('shared.preferences.datetime.date_format.label')}
            value={me.preferences?.dateFormat}
            options={
              t('shared.preferences.datetime.date_format.formats', {
                returnObjects: true,
              }) as PickerItem[]
            }
            onChange={onChangeDateFormat as PickerOnChange}
          />

          <SelectPicker
            label={t('shared.preferences.datetime.time_format.label')}
            sheetLabel={t('shared.preferences.datetime.time_format.label')}
            value={me.preferences?.timeFormat}
            options={
              t('shared.preferences.datetime.time_format.formats', {
                returnObjects: true,
              }) as PickerItem[]
            }
            onChange={onChangeTimeFormat as PickerOnChange}
          />

          <SelectPicker
            label={t('shared.preferences.datetime.date_element.label')}
            sheetLabel={t('shared.preferences.datetime.date_element.label')}
            value={me.preferences?.appearance?.date?.element || null}
            options={
              t('shared.preferences.datetime.date_element.types', {
                returnObjects: true,
              }) as PickerItem[]
            }
            onChange={onChangeDateElement as PickerOnChange}
          />
        </FormView>
      )}
    </PageView>
  );
};
