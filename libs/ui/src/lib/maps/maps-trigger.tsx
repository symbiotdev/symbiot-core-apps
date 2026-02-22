import { ReactElement, useCallback, useRef } from 'react';
import { Alert, Linking } from 'react-native';
import { ListItem } from '../list/list-item';
import { useI18n } from '@symbiot-core-apps/shared';
import { AdaptiveSheet, AdaptiveSheetRef } from '@symbiot-core-apps/ui2';

export const MapsTrigger = ({
  address,
  disabled,
  trigger,
}: {
  address: string;
  disabled?: boolean;
  trigger: ReactElement;
}) => {
  const { t } = useI18n();
  const sheetRef = useRef<AdaptiveSheetRef>(null);

  const open = useCallback(
    async (type: 'google' | 'apple') => {
      sheetRef.current?.hide();

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
    <AdaptiveSheet
      ref={sheetRef}
      disabled={disabled}
      sheetTitle={t('shared.maps.open.title')}
      trigger={trigger}
    >
      <ListItem label="Apple Maps" onPress={() => open('apple')} />
      <ListItem label="Google Maps" onPress={() => open('google')} />
    </AdaptiveSheet>
  );
};
