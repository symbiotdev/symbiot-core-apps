import {
  Accordion,
  ActionCard,
  FormView,
  Icon,
  LoadingView,
  PageView,
} from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useT } from '@symbiot-core-apps/i18n';
import { useFaq } from '@symbiot-core-apps/state';

export const Faq = () => {
  const { t } = useT();
  const { sortedFaq } = useFaq();

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
          <Accordion items={sortedFaq} />

          <ActionCard
            title={t('faq.contact_us.title')}
            subtitle={t('faq.contact_us.subtitle')}
            buttonLabel={t('faq.contact_us.button.label')}
            buttonIcon={<Icon name="Letter" />}
            onActionPress={openMail}
          />
        </FormView>
      )}
    </PageView>
  );
};
