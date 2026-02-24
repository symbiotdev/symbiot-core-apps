import { Card, CompactView, RegularText, Spinner } from '@symbiot-core-apps/ui';
import { useEffect, useMemo } from 'react';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { queryClient } from '@symbiot-core-apps/api';
import { allLanguages, useI18n } from '@symbiot-core-apps/shared';
import { ScrollablePage, ToggleList } from '@symbiot-core-apps/ui2';

export const Language = () => {
  const { lang, supportedLanguages, changeLanguage } = useI18n();
  const navigation = useNavigation();
  const { updateAccount$, updating } = useCurrentAccountUpdater();

  const options = useMemo(
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
    <ScrollablePage>
      <CompactView>
        <Card paddingVertical={0}>
          <ToggleList
            scrollEnabled={false}
            options={options}
            value={lang}
            onChange={async (language) => {
              await updateAccount$({ language: language as string });
              changeLanguage(language as string);
              queryClient.clear();
            }}
          />
        </Card>
      </CompactView>
    </ScrollablePage>
  );
};
