import { CompactView, ListItemGroup, Spinner } from '@symbiot-core-apps/ui';
import { useCallback, useEffect, useMemo } from 'react';
import {
  useCurrentAccountPreferences,
  useCurrentAccountUpdater,
} from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { activeSystemScheme, useI18n } from '@symbiot-core-apps/shared';
import { Switch } from '@symbiot-core-apps/form-controller';
import { AccountAppearance } from '@symbiot-core-apps/api';
import {
  Icon,
  ScrollablePage,
  ToggleList,
  ToggleListOnChange,
} from '@symbiot-core-apps/ui2';

export const SchemeAppearance = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const { updatePreferences$, updating } = useCurrentAccountUpdater();
  const preferences = useCurrentAccountPreferences();
  const scheme = preferences?.appearance?.scheme;

  const options = useMemo(
    () => [
      {
        icon: <Icon name="Sun" />,
        label: t('shared.preferences.scheme.theme.light'),
        value: 'light',
      },
      {
        icon: <Icon name="Moon" />,
        label: t('shared.preferences.scheme.theme.dark'),
        value: 'dark',
      },
    ],
    [t],
  );

  const onChange = useCallback(
    (scheme: AccountAppearance['scheme']) =>
      updatePreferences$({
        appearance: {
          scheme,
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
        <ListItemGroup
          // title={t('shared.preferences.scheme.theme.title')}
          gap="$4"
          paddingVertical="$4"
        >
          <Switch
            checked={!scheme}
            disabled={updating}
            label={t('shared.preferences.scheme.theme.auto.label')}
            onChange={(checked) =>
              onChange(checked ? null : activeSystemScheme())
            }
          />

          {!!scheme && (
            <ToggleList
              scrollEnabled={false}
              disabled={updating}
              options={options}
              value={scheme}
              onChange={onChange as ToggleListOnChange}
            />
          )}
        </ListItemGroup>
      </CompactView>
    </ScrollablePage>
  );
};
