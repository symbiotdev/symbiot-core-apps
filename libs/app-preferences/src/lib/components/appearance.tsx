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
import { AccountScheme } from '@symbiot-core-apps/api';
import { useNavigation } from '@react-navigation/native';
import { defaultSystemScheme } from '@symbiot-core-apps/shared';
import { useT } from '@symbiot-core-apps/i18n';

export const Appearance = () => {
  const navigation = useNavigation();
  const { t } = useT();
  const { me, updatePreferences$, updating } = useCurrentAccountUpdater();
  const scheme = me?.preferences?.scheme;

  const items = useMemo(
    () => [
      {
        icon: <Icon name="Sun" />,
        label: t('preferences.appearance.theme.light'),
        value: 'light',
      },
      {
        icon: <Icon name="Moon" />,
        label: t('preferences.appearance.theme.dark'),
        value: 'dark',
      },
    ],
    [t],
  );

  const onChange = useCallback(
    (scheme: AccountScheme) => updatePreferences$({ scheme }),
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
          title={t('preferences.appearance.theme.title')}
          gap="$4"
          paddingVertical="$4"
        >
          <Switch
            checked={scheme === 'system'}
            disabled={updating}
            label={t('preferences.appearance.theme.auto.label')}
            onChange={(checked) =>
              onChange(checked ? 'system' : defaultSystemScheme())
            }
          />
          {scheme !== 'system' && (
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
