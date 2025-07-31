import {
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useT } from '@symbiot-core-apps/i18n';

export const HelpFeedback = () => {
  const { t } = useT();

  const openMail = useCallback(
    () => Linking.openURL(`mailto:${process.env.EXPO_PUBLIC_SUPPORT_EMAIL}`),
    [],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ListItemGroup>
          <ListItem
            label={t('email')}
            icon={<Icon name="Letter" />}
            onPress={openMail}
          />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
