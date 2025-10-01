import { ReactElement, useCallback, useRef } from 'react';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
} from '../popover/adaptive-popover';
import { useTranslation } from 'react-i18next';
import { Alert, Linking } from 'react-native';
import { ListItem } from '../list/list-item';

export const MapsTrigger = ({
  address,
  disableDrag,
  trigger,
}: {
  address: string;
  disableDrag?: boolean;
  trigger: ReactElement;
}) => {
  const { t } = useTranslation();
  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const open = useCallback(
    async (type: 'google' | 'apple') => {
      popoverRef.current?.close();

      const encodedAddress = encodeURIComponent(address);

      try {
        if (type === 'google') {
          await Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
          );
        } else if (type === 'apple') {
          await Linking.openURL(
            `https://maps.apple.com/?address=${encodedAddress}`,
          );
        }
      } catch {
        Alert.alert(
          t('shared.maps.error.title'),
          t('shared.maps.error.subtitle'),
        );
      }
    },
    [address, t],
  );

  return (
    <AdaptivePopover
      ref={popoverRef}
      disableDrag={disableDrag}
      triggerType="child"
      placement="bottom"
      sheetTitle={t('shared.maps.open.title')}
      trigger={trigger}
    >
      <ListItem label="Apple Maps" onPress={() => open('apple')} />
      <ListItem label="Google Maps" onPress={() => open('google')} />
    </AdaptivePopover>
  );
};
