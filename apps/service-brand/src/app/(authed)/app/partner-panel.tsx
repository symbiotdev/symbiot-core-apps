import {
  CompactView,
  H2,
  Icon,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import {
  emitHaptic,
  ShowNativeSuccessAlert,
  useI18n,
} from '@symbiot-core-apps/shared';
import { XStack } from 'tamagui';
import { Pressable } from 'react-native';
import { useCallback } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

export default () => {
  const { t } = useI18n();
  const { me } = useCurrentAccountState();

  return (
    !!me?.partner && (
      <PageView scrollable withHeaderHeight>
        <CompactView>
          <ListItemGroup
            title={t('shared.partner_program.panel.your_promo_code')}
          >
            <XStack
              paddingVertical="$3"
              justifyContent="space-between"
              gap="$2"
              alignItems="center"
            >
              <H2 textTransform="uppercase" numberOfLines={1}>
                {me.partner.promoCode}
              </H2>

              <CopyButton text={me.partner.promoCode} />
            </XStack>
          </ListItemGroup>
        </CompactView>
      </PageView>
    )
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const { t } = useI18n();
  const onPress = useCallback(() => {
    emitHaptic();

    Clipboard.setString(text);

    ShowNativeSuccessAlert({
      title: t('shared.copied'),
    });
  }, [t, text]);

  return (
    <Pressable onPress={onPress}>
      <Icon name="Copy" />
    </Pressable>
  );
};
