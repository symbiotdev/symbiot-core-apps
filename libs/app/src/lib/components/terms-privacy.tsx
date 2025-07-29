import {
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from 'expo-web-browser';
import { ReactNativeLegal } from 'react-native-legal';

export const TermsPrivacy = () => {
  const { t } = useTranslation();

  const openTermsConditions = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_TERMS_CONDITIONS_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    [],
  );

  const openPrivacyPolicyConditions = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    [],
  );

  const openOOS = useCallback(
    () => ReactNativeLegal.launchLicenseListScreen('OSS Notice'),
    [],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ListItemGroup>
          <ListItem
            label={t('shared.docs.terms_conditions')}
            icon={<Icon name="FileText" />}
            onPress={openTermsConditions}
          />
          <ListItem
            label={t('shared.docs.privacy_policy')}
            icon={<Icon name="FileText" />}
            onPress={openPrivacyPolicyConditions}
          />
          <ListItem
            label="OOS Notice"
            icon={<Icon name="FileText" />}
            onPress={openOOS}
          />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
