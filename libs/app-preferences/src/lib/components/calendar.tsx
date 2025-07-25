import {
  FormView,
  onChangeSelect,
  PageView,
  Select,
  Spinner,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo } from 'react';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useMeUpdater } from '@symbiot-core-apps/store';
import { useNavigation } from '@react-navigation/native';
import { Day } from 'date-fns/types';

export const Calendar = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { me, updatePreferences$, updating } = useMeUpdater();

  const weekdaysOptions = useMemo(() => DateHelper.getWeekdays(), []);

  const onChangeWeekdayStartsOn = useCallback(
    (weekStartsOn: Day) => updatePreferences$({ weekStartsOn }),
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
          disabled={updating}
          label={t('shared.preferences.calendar.week_starts_on.label')}
          value={me?.preferences?.weekStartsOn}
          options={weekdaysOptions}
          onChange={onChangeWeekdayStartsOn as onChangeSelect}
        />
      </FormView>
    </PageView>
  );
};
