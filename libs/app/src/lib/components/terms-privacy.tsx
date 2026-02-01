import {
  CompactView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from 'expo-web-browser';
import { ReactNativeLegal } from 'react-native-legal';
import { useI18n } from '@symbiot-core-apps/shared';

export const TermsPrivacy = () => {
  const { t } = useI18n();

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
      <CompactView>
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
      </CompactView>
    </PageView>
  );
};
