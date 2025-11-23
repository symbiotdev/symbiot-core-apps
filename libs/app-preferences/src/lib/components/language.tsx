import {
  Card,
  FormView,
  PageView,
  RegularText,
  Spinner,
  ToggleGroup,
} from '@symbiot-core-apps/ui';
import { useEffect, useMemo } from 'react';
import { changeAppLanguage } from '@symbiot-core-apps/i18n';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';
import { queryClient } from '@symbiot-core-apps/api';

export const Language = () => {
  const { i18n } = useTranslation();
  const { languages } = useApp();
  const navigation = useNavigation();
  const { updateAccount$, updating } = useCurrentAccountUpdater();

  const items = useMemo(
    () =>
      languages.map(({ flag, code, name }) => ({
        icon: <RegularText fontSize={28}>{flag}</RegularText>,
        label: name,
        value: code,
      })),
    [languages],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: updating ? () => <Spinner /> : undefined,
    });
  }, [updating, navigation]);

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <Card paddingVertical={0}>
          <ToggleGroup
            items={items}
            value={i18n.language}
            onChange={async (language) => {
              await updateAccount$({ language: language as string });
              changeAppLanguage(language as string);
              queryClient.clear();
            }}
          />
        </Card>
      </FormView>
    </PageView>
  );
};
