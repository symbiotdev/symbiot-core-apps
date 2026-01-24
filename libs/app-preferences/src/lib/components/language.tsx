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
import { queryClient } from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export const Language = () => {
  const { lang } = useI18n();
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
            value={lang}
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
