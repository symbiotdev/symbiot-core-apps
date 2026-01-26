import {
  FormView,
  Icon,
  ListItemGroup,
  PageView,
  Spinner,
  Switch,
  ToggleGroup,
  ToggleOnChange,
} from '@symbiot-core-apps/ui';
import { useCallback, useEffect, useMemo } from 'react';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import {
  defaultSystemScheme,
  Scheme,
  useI18n,
} from '@symbiot-core-apps/shared';

export const Appearance = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const { me, updatePreferences$, updating } = useCurrentAccountUpdater();
  const scheme = me?.preferences?.appearance?.scheme;

  const items = useMemo(
    () => [
      {
        icon: <Icon name="Sun" />,
        label: t('shared.preferences.appearance.theme.light'),
        value: 'light',
      },
      {
        icon: <Icon name="Moon" />,
        label: t('shared.preferences.appearance.theme.dark'),
        value: 'dark',
      },
    ],
    [t],
  );

  const onChange = useCallback(
    (scheme: Scheme | null) =>
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
      <FormView>
        <ListItemGroup
          // title={t('shared.preferences.appearance.theme.title')}
          gap="$4"
          paddingVertical="$4"
        >
          <Switch
            checked={!scheme}
            disabled={updating}
            label={t('shared.preferences.appearance.theme.auto.label')}
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
      </FormView>
    </PageView>
  );
};
