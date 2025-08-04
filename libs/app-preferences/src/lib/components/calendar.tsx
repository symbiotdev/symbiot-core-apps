import {
  FormView,
  onChangeSelect,
  PageView,
  Select,
  Spinner,
} from '@symbiot-core-apps/ui';
import { useCallback, useEffect, useMemo } from 'react';
import { DateHelper, Weekday } from '@symbiot-core-apps/shared';
import { useMeUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { useT } from '@symbiot-core-apps/i18n';

export const Calendar = () => {
  const navigation = useNavigation();
  const { t } = useT();
  const { me, updatePreferences$, updating } = useMeUpdater();

  const weekdaysOptions = useMemo(() => DateHelper.getWeekdays(), []);

  const onChangeWeekdayStartsOn = useCallback(
    (weekStartsOn: Weekday) => updatePreferences$({ weekStartsOn }),
    [updatePreferences$],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: updating ? () => <Spinner /> : undefined,
    });
  }, [updating, navigation]);

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <Select
          label={t('preferences.calendar.week_starts_on.label')}
          value={me?.preferences?.weekStartsOn}
          options={weekdaysOptions}
          onChange={onChangeWeekdayStartsOn as onChangeSelect}
        />
      </FormView>
    </PageView>
  );
};
