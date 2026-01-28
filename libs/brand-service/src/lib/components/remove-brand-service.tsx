import { ActionCard, FrameView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import { BrandService, useRemoveBrandServiceReq } from '@symbiot-core-apps/api';
import { router } from 'expo-router';

export const RemoveBrandService = ({ service }: { service: BrandService }) => {
  const { t } = useI18n();
  const { mutateAsync, isPending } = useRemoveBrandServiceReq();

  const onPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand_service.remove.confirm_dialog.title'),
        message: t('brand_service.remove.confirm_dialog.message'),
        onAgree: async () => {
          await mutateAsync({ id: service.id });

          router.dismissAll();
          router.push('/services');
        },
      }),
    [service.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FrameView>
        <ActionCard
          title={t('brand_service.remove.title')}
          subtitle={t('brand_service.remove.subtitle', {
            name: service.name,
          })}
          buttonLabel={t('brand_service.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onPress={onPress}
        />
      </FrameView>
    </PageView>
  );
};
