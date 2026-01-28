import {
  CompactView,
  Icon,
  ListItemGroup,
  PageView,
  Spinner,
} from '@symbiot-core-apps/ui';
import { useCallback, useEffect, useMemo } from 'react';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import {
  defaultSystemScheme,
  SystemScheme,
  useI18n,
} from '@symbiot-core-apps/shared';
import {
  Switch,
  ToggleGroup,
  ToggleOnChange,
} from '@symbiot-core-apps/form-controller';

export const Scheme = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const { me, updatePreferences$, updating } = useCurrentAccountUpdater();
  const scheme = me?.preferences?.appearance?.scheme;

  const items = useMemo(
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
    (scheme: SystemScheme | null) =>
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
    <PageView scrollable withHeaderHeight>
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
              onChange(checked ? null : defaultSystemScheme())
            }
          />

          {!!scheme && (
            <ToggleGroup
              disabled={updating}
              items={items}
              value={scheme}
              onChange={onChange as ToggleOnChange}
            />
          )}
        </ListItemGroup>
      </CompactView>
    </PageView>
  );
};
