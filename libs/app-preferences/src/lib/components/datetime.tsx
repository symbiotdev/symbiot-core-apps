import { CompactView, Spinner } from '@symbiot-core-apps/ui';
import { useCallback, useEffect } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';
import {
  useCurrentAccountPreferences,
  useCurrentAccountUpdater,
} from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { DateElementType } from '@symbiot-core-apps/api';
import {
  PickerItem,
  PickerOnChange,
  SmartSelect,
} from '@symbiot-core-apps/form-controller';
import { ScrollablePage } from '@symbiot-core-apps/ui2';

export const Datetime = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const { updatePreferences$, updating } = useCurrentAccountUpdater();
  const preferences = useCurrentAccountPreferences();

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
    <ScrollablePage>
      <CompactView>
        <SmartSelect
          searchable={false}
          moveSelectedToTop={false}
          label={t('shared.preferences.datetime.date_format.label')}
          value={preferences.dateFormat}
          options={
            t('shared.preferences.datetime.date_format.formats', {
              returnObjects: true,
            }) as PickerItem[]
          }
          onChange={onChangeDateFormat as PickerOnChange}
        />

        <SmartSelect
          searchable={false}
          moveSelectedToTop={false}
          label={t('shared.preferences.datetime.time_format.label')}
          value={preferences.timeFormat}
          options={
            t('shared.preferences.datetime.time_format.formats', {
              returnObjects: true,
            }) as PickerItem[]
          }
          onChange={onChangeTimeFormat as PickerOnChange}
        />

        <SmartSelect
          searchable={false}
          moveSelectedToTop={false}
          label={t('shared.preferences.datetime.date_element.label')}
          value={preferences.appearance?.date?.element || null}
          options={
            t('shared.preferences.datetime.date_element.types', {
              returnObjects: true,
            }) as PickerItem[]
          }
          onChange={onChangeDateElement as PickerOnChange}
        />
      </CompactView>
    </ScrollablePage>
  );
};
