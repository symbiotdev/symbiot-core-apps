import { Icon, ListItem, ListItemGroup, PageView } from '@symbiot-core-apps/ui';
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
      <ListItemGroup>
        <ListItem
          label="@symbiothub"
          icon={<Icon.Dynamic type="FontAwesome6" name="x-twitter" />}
          onPress={openTwitter}
        />
        <ListItem
          label="@symbiothub"
          icon={<Icon.Dynamic type="Ionicons" name="logo-instagram" />}
          onPress={openInstagram}
        />
        <ListItem
          label="@symbiothub"
          icon={<Icon.Dynamic type="AntDesign" name="linkedin-square" />}
          onPress={openLinkedin}
        />
      </ListItemGroup>
    </PageView>
  );
};
