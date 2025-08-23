import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
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
import { emitHaptic } from '@symbiot-core-apps/shared';
import { MyBrandsSelectionList } from '@symbiot-core-apps/brand';
import { useApp } from '@symbiot-core-apps/app';

export default () => {
  const { t } = useT();
  const { icons } = useApp();
  const { me } = useCurrentAccount();
  const { brands: currentBrands } = useCurrentBrandState();

  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const createBrand = useCallback(() => router.navigate('/brand/create'), []);

  const onOpenQrCodeModal = useCallback(() => {
    emitHaptic();
    setQrCodeVisible(true);
  }, []);
  const onCloseQrCodeModal = useCallback(() => {
    emitHaptic();
    setQrCodeVisible(false);
  }, []);

  return (
    <>
      <TabsPageView withHeaderHeight scrollable gap="$5" alignItems="center">
        {currentBrands?.length ? (
          <MyBrandsSelectionList />
        ) : (
          <FormView gap="$6">
            <View gap="$2">
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
              subtitle={t('initial_actions.create_workspace.subtitle', {
                ns: 'app',
              })}
              buttonLabel={t('initial_actions.create_workspace.button.label', {
                ns: 'app',
              })}
              buttonIcon={<Icon name={icons.Workspace} />}
              onActionPress={createBrand}
            />

            <H4 textAlign="center" textTransform="uppercase">
              {t('or')}
            </H4>

            <ActionCard
              title={t('initial_actions.join_workspace.title', {
                ns: 'app',
              })}
              subtitle={t('initial_actions.join_workspace.subtitle', {
                ns: 'app',
              })}
              buttonLabel={t('initial_actions.join_workspace.button.label', {
                ns: 'app',
              })}
              buttonIcon={<Icon name="QrCode" />}
              onActionPress={onOpenQrCodeModal}
            />
          </FormView>
        )}
      </TabsPageView>

      {me && (
        <QrCodeModal
          visible={qrCodeVisible}
          qrValue={me.id}
          qrContent={<RegularText fontSize={30}>🤩</RegularText>}
          onClose={onCloseQrCodeModal}
        />
      )}
    </>
  );
};
