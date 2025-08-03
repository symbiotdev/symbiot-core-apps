import {
  Accordion,
  ActionCard,
  FormView,
  Icon,
  PageView,
} from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useT } from '@symbiot-core-apps/i18n';

export const Faq = () => {
  const { t } = useT();

  const openMail = useCallback(
    () => Linking.openURL(`mailto:${process.env.EXPO_PUBLIC_SUPPORT_EMAIL}`),
    [],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <Accordion items={[]} />

        <ActionCard
          title={t('faq.contact_us.title')}
          subtitle={t('faq.contact_us.subtitle')}
          buttonLabel={t('faq.contact_us.button.label')}
          buttonIcon={<Icon name="Letter" />}
          onActionPress={openMail}
        />
      </FormView>
    </PageView>
  );
};
