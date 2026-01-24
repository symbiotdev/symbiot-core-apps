import { ReactElement, useCallback, useRef } from 'react';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
} from '../popover/adaptive-popover';
import { Alert, Linking } from 'react-native';
import { ListItem } from '../list/list-item';
import { useI18n } from '@symbiot-core-apps/shared';

export const MapsTrigger = ({
  address,
  disableDrag,
  disabled,
  trigger,
}: {
  address: string;
  disableDrag?: boolean;
  disabled?: boolean;
  trigger: ReactElement;
}) => {
  const { t } = useI18n();
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
      disabled={disabled}
      disableDrag={disableDrag}
      placement="bottom"
      sheetTitle={t('shared.maps.open.title')}
      trigger={trigger}
    >
      <ListItem label="Apple Maps" onPress={() => open('apple')} />
      <ListItem label="Google Maps" onPress={() => open('google')} />
    </AdaptivePopover>
  );
};
