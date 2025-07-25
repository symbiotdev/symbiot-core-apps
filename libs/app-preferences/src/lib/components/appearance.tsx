import {
  FormView,
  Icon,
  ListItemGroup,
  PageView,
  Spinner,
  Switch,
  ToggleGroup,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo } from 'react';
import { useMeUpdater } from '@symbiot-core-apps/store';
import { AccountScheme } from '@symbiot-core-apps/api';
import { useNavigation } from '@react-navigation/native';
import { defaultSystemScheme, Scheme } from '@symbiot-core-apps/shared';

export const Appearance = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { me, updatePreferences$, updating } = useMeUpdater();
  const scheme = me?.preferences?.scheme;

  const items = useMemo(
    () => [
      {
        icon: (
          <Icon.Dynamic
            type="Ionicons"
            name="sunny-outline"
            color="$disabled"
          />
        ),
        label: t('shared.preferences.appearance.theme.light'),
        value: 'light',
      },
      {
        icon: (
          <Icon.Dynamic type="Ionicons" name="moon-outline" color="$disabled" />
        ),
        label: t('shared.preferences.appearance.theme.dark'),
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
          title={t('shared.preferences.appearance.theme.title')}
          gap="$4"
          paddingVertical="$4"
        >
          <Switch
            checked={scheme === 'system'}
            disabled={updating}
            label={t('shared.preferences.appearance.theme.auto.label')}
            onChange={(checked) =>
              onChange(checked ? 'system' : defaultSystemScheme())
            }
          />
          {scheme !== 'system' && (
            <ToggleGroup
              disabled={updating}
              items={items}
              value={[scheme]}
              onChange={(result) => onChange(result[0] as Scheme)}
            />
          )}
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
