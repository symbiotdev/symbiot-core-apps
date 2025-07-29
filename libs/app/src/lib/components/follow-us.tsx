import {
  FormView,
  ListItem,
  ListItemGroup,
  PageView,
  SocialIcon,
} from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from 'expo-web-browser';

export const FollowUs = () => {
  const openTwitter = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_X_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    [],
  );
  const openInstagram = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_INSTAGRAM_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    [],
  );
  const openLinkedin = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_LINKEDIN_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    [],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ListItemGroup>
          <ListItem
            label="@symbiothub"
            icon={<SocialIcon name="X" />}
            onPress={openTwitter}
          />
          <ListItem
            label="@symbiothub"
            icon={<SocialIcon name="Instagram" />}
            onPress={openInstagram}
          />
          <ListItem
            label="@symbiothub"
            icon={<SocialIcon name="LinkedIn" />}
            onPress={openLinkedin}
          />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
