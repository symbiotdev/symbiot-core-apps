import {
  Card,
  FrameView,
  PageView,
  RegularText,
  Spinner,
} from '@symbiot-core-apps/ui';
import { useEffect, useMemo } from 'react';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { queryClient } from '@symbiot-core-apps/api';
import { allLanguages, useI18n } from '@symbiot-core-apps/shared';
import { ToggleGroup } from '@symbiot-core-apps/form-controller';

export const Language = () => {
  const { lang, supportedLanguages, changeLanguage } = useI18n();
  const navigation = useNavigation();
  const { updateAccount$, updating } = useCurrentAccountUpdater();

  const items = useMemo(
    () =>
      allLanguages
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
      <FrameView>
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
      </FrameView>
    </PageView>
  );
};
