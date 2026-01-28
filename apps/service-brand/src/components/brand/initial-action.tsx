import { useAppSettings } from '@symbiot-core-apps/app';
import {
  useCurrentAccountState,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { emitHaptic, useI18n } from '@symbiot-core-apps/shared';
import {
  ActionCard,
  FrameView,
  H2,
  H4,
  Icon,
  QrCodeModal,
  RegularText,
  TabsPageView,
} from '@symbiot-core-apps/ui';
import { MyBrandsSelectionList } from '@symbiot-core-apps/brand';
import { View } from 'tamagui';

export const InitialAction = () => {
  const { me } = useCurrentAccountState();
  const { brands: currentBrands } = useCurrentBrandState();
  const { t } = useI18n();
  const { icons } = useAppSettings();

  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const createBrand = useCallback(() => router.push('/brand/create'), []);

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
          <FrameView gap="$6" marginVertical="auto">
            <View gap="$2">
              <H2 textAlign="center">{t('initial_actions.title')}</H2>
              <RegularText textAlign="center">
                {t('initial_actions.subtitle')}
              </RegularText>
            </View>

            <ActionCard
              title={t('initial_actions.create_workspace.title')}
              subtitle={t('initial_actions.create_workspace.subtitle')}
              buttonLabel={t('initial_actions.create_workspace.button.label')}
              buttonIcon={<Icon name={icons.Workspace} />}
              onPress={createBrand}
            />

            <H4 textAlign="center">{t('shared.or')}</H4>

            <ActionCard
              title={t('initial_actions.join_workspace.title')}
              subtitle={t('initial_actions.join_workspace.subtitle')}
              buttonLabel={t('initial_actions.join_workspace.button.label')}
              buttonIcon={<Icon name="QrCode" />}
              onPress={onOpenQrCodeModal}
            />
          </FrameView>
        )}
      </TabsPageView>

      {me && (
        <QrCodeModal
          visible={qrCodeVisible}
          qrValue={me.id}
          title={`ID: ${me.id}`}
          qrContent={<RegularText fontSize={30}>🤩</RegularText>}
          onClose={onCloseQrCodeModal}
        />
      )}
    </>
  );
};
