import {
  Card,
  FormView,
  PageView,
  RegularText,
  Spinner,
  ToggleGroup,
} from '@symbiot-core-apps/ui';
import { useEffect, useMemo } from 'react';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { queryClient } from '@symbiot-core-apps/api';
import { appLanguages, useI18n } from '@symbiot-core-apps/shared';

export const Language = () => {
  const { lang, supportedLanguages, changeLanguage } = useI18n();
  const navigation = useNavigation();
  const { updateAccount$, updating } = useCurrentAccountUpdater();

  const items = useMemo(
    () =>
      appLanguages
        .filter(({ code }) => supportedLanguages.includes(code))
        .map(({ flag, code, name }) => ({
          icon: <RegularText fontSize={28}>{flag}</RegularText>,
          label: name,
          value: code,
        })),
    [supportedLanguages],
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
              changeLanguage(language as string);
              queryClient.clear();
            }}
          />
        </Card>
      </FormView>
    </PageView>
  );
};
