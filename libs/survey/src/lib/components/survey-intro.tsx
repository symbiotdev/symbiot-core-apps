import { useT } from '@symbiot-core-apps/i18n';
import { View } from 'tamagui';
import {
  Button,
  FormView,
  H2,
  Icon,
  IconName,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { memo } from 'react';

export const SurveyIntro = memo(
  ({ iconName, onStart }: { iconName: IconName; onStart: () => void }) => {
    const { t } = useT();

    return (
      <PageView
        scrollable
        alignItems="center"
        justifyContent="center"
        gap="$10"
        animation="medium"
        opacity={1}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      >
        <FormView flex={1}>
          <View marginVertical="auto" alignItems="center" gap="$5">
            <Icon name={iconName} size={60} />

            <View gap="$2">
              <H2 textAlign="center">
                {t('brand.create.intro.title', {
                  ns: 'app',
                })}
              </H2>
              <RegularText textAlign="center">
                {t('brand.create.intro.subtitle', {
                  ns: 'app',
                })}
              </RegularText>
            </View>
          </View>

          <Button
            label={t('brand.create.intro.button.label', {
              ns: 'app',
            })}
            onPress={onStart}
          />
        </FormView>
      </PageView>
    );
  },
);
