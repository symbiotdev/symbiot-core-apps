import {
  Accordion,
  ActionCard,
  FormView,
  Icon,
  LoadingView,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { useCallback, useMemo } from 'react';
import { Linking } from 'react-native';
import { useFaqState } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';

export const Faq = () => {
  const { t } = useTranslation();
  const { faq } = useFaqState();

  const sortedFaq = useMemo(() => faq?.sort((a, b) => b.rate - a.rate), [faq]);

  const openMail = useCallback(
    () => Linking.openURL(`mailto:${process.env.EXPO_PUBLIC_SUPPORT_EMAIL}`),
    [],
  );

  return (
    <PageView scrollable withHeaderHeight>
      {!sortedFaq ? (
        <LoadingView />
      ) : (
        <FormView>
          <Accordion
            items={sortedFaq.map((item) => ({
              title: item.title,
              content: <RegularText>{item.text}</RegularText>,
            }))}
          />

          <ActionCard
            title={t('shared.faq.contact_us.title')}
            subtitle={t('shared.faq.contact_us.subtitle')}
            buttonLabel={t('shared.faq.contact_us.button.label')}
            buttonIcon={<Icon name="Letter" />}
            onPress={openMail}
          />
        </FormView>
      )}
    </PageView>
  );
};
