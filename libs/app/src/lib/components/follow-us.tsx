import {
  CompactView,
  Icon,
  ListItem,
  ListItemGroup,
} from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from 'expo-web-browser';
import { ScrollablePage } from '@symbiot-core-apps/ui2';

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
    <ScrollablePage>
      <CompactView>
        <ListItemGroup>
          {/*<ListItem*/}
          {/*  label="@symbiothub"*/}
          {/*  icon={<Icon name="X" />}*/}
          {/*  onPress={openTwitter}*/}
          {/*/>*/}
          <ListItem
            label="@symbiothub"
            icon={<Icon name="Instagram" />}
            onPress={openInstagram}
          />
          <ListItem
            label="@symbiothub"
            icon={<Icon name="LinkedIn" />}
            onPress={openLinkedin}
          />
        </ListItemGroup>
      </CompactView>
    </ScrollablePage>
  );
};
