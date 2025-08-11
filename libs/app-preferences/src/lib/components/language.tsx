import {
  Card,
  FormView,
  PageView,
  RegularText,
  Spinner,
  ToggleGroup,
} from '@symbiot-core-apps/ui';
import { useEffect, useMemo } from 'react';
import {
  AppLanguage,
  appLanguagesOptions,
  useT,
} from '@symbiot-core-apps/i18n';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';

export const Language = () => {
  const { lang } = useT();
  const navigation = useNavigation();
  const { updateAccount$, updating } = useCurrentAccountUpdater();

  const items = useMemo(
    () =>
      appLanguagesOptions.map(({ flag, code, name }) => ({
        icon: (
          <RegularText fontSize={28}>
            {flag}
          </RegularText>
        ),
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
      <FormView>
        <Card>
          <ToggleGroup
            items={items}
            value={lang}
            onChange={(result) =>
              updateAccount$({ language: result as AppLanguage })
            }
          />
        </Card>
      </FormView>
    </PageView>
  );
};
