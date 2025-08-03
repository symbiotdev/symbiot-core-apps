import { useMe } from '@symbiot-core-apps/state';
import { useT } from '@symbiot-core-apps/i18n';
import { useCallback, useState } from 'react';
import {
  ActionCard,
  FormView,
  H2,
  H4,
  Icon,
  QrCodeModal,
  RegularText,
  TabsPageView,
} from '@symbiot-core-apps/ui';
import { View } from 'tamagui';

export default () => {
  const { me } = useMe();
  const { t } = useT();

  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const onOpenQrCodeModal = useCallback(() => setQrCodeVisible(true), []);
  const onCloseQrCodeModal = useCallback(() => setQrCodeVisible(false), []);

  return (
    me && (
      <>
        <TabsPageView withHeaderHeight scrollable gap="$5" alignItems="center">
          <FormView gap="$6">
            <View gap="$3">
              <H2>
                {t('initial_actions.title', {
                  ns: 'app',
                })}
              </H2>
              <RegularText>
                {t('initial_actions.subtitle', {
                  ns: 'app',
                })}
              </RegularText>
            </View>

            <ActionCard
              title={t('initial_actions.create_workspace.title', {
                ns: 'app',
              })}
              subtitle={t('initial_actions.create_workspace.title', {
                ns: 'app',
              })}
              buttonLabel={t('initial_actions.create_workspace.button.label', {
                ns: 'app',
              })}
              buttonIcon={<Icon name="Heart" />}
              onActionPress={() => alert('create')}
            />

            <H4 textAlign="center" textTransform="uppercase">
              {t('or')}
            </H4>

            <ActionCard
              title={t('initial_actions.join_workspace.title', {
                ns: 'app',
              })}
              subtitle={t('initial_actions.join_workspace.title', {
                ns: 'app',
              })}
              buttonLabel={t('initial_actions.join_workspace.button.label', {
                ns: 'app',
              })}
              buttonIcon={<Icon name="QrCode" />}
              onActionPress={onOpenQrCodeModal}
            />
          </FormView>
        </TabsPageView>

        <QrCodeModal
          visible={qrCodeVisible}
          qrValue={me.id}
          qrContent={<RegularText fontSize={30}>🤩</RegularText>}
          onClose={onCloseQrCodeModal}
        />
      </>
    )
  );
};
