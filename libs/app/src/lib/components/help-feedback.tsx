import {
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { Linking } from 'react-native';

export const HelpFeedback = () => {
  const { t } = useTranslation();

  const openMail = useCallback(
    () => Linking.openURL(`mailto:${process.env.EXPO_PUBLIC_SUPPORT_EMAIL}`),
    [],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ListItemGroup>
          <ListItem
            label={t('shared.email')}
            icon={<Icon.Dynamic type="Ionicons" name="mail-outline" />}
            onPress={openMail}
          />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
