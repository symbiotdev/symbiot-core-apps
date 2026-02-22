import { ActionCard, CompactView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import { BrandService, useRemoveBrandServiceReq } from '@symbiot-core-apps/api';
import { router } from 'expo-router';
import { Icon, ScrollablePage } from '@symbiot-core-apps/ui2';

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
    <ScrollablePage>
      <CompactView>
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
      </CompactView>
    </ScrollablePage>
  );
};
