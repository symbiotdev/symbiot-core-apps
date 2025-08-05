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
import { router } from 'expo-router';
import { Icons } from '../../../../icons/config';
import { emitHaptic } from '@symbiot-core-apps/shared';

export default () => {
  const { me } = useMe();
  const { t } = useT();

  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const createBusiness = useCallback(
    () => router.navigate('/business/create'),
    [],
  );

  const onOpenQrCodeModal = useCallback(() => {
    emitHaptic();
    setQrCodeVisible(true);
  }, []);
  const onCloseQrCodeModal = useCallback(() => {
    emitHaptic();
    setQrCodeVisible(false);
  }, []);

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
              buttonIcon={<Icon name={Icons.Workspace} />}
              onActionPress={createBusiness}
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
