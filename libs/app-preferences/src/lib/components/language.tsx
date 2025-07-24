import {
  Card,
  PageView,
  RegularText,
  Spinner,
  ToggleGroup,
} from '@symbiot-core-apps/ui';
import { useEffect, useMemo } from 'react';
import { AppLanguage, appLanguagesOptions } from '@symbiot-core-apps/i18n';
import { useMeUpdater } from '@symbiot-core-apps/store';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export const Language = () => {
  const { i18n } = useTranslation();
  const navigation = useNavigation();
  const { updateAccount$, updating } = useMeUpdater();

  const items = useMemo(
    () =>
      appLanguagesOptions.map(({ flag, code, name }) => ({
        icon: <RegularText lineHeight="100%">{flag}</RegularText>,
        label: name,
        value: code,
      })),
    [],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: updating ? () => <Spinner /> : undefined,
    });
  }, [updating, navigation]);

  return (
    <PageView scrollable withHeaderHeight>
      <Card>
        <ToggleGroup
          items={items}
          value={[i18n.language]}
          onChange={(result) =>
            updateAccount$({ language: result[0] as AppLanguage })
          }
        />
      </Card>
    </PageView>
  );
};
