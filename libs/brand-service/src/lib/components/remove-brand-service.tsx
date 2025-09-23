import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import {
  BrandService,
  useRemoveBrandServiceQuery,
} from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export const RemoveBrandService = ({ service }: { service: BrandService }) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useRemoveBrandServiceQuery();

  const onActionPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand_service.remove.confirm_dialog.title'),
        message: t('brand_service.remove.confirm_dialog.message'),
        callback: async () => {
          await mutateAsync({ id: service.id });

          router.dismissAll();
          router.push('/services');
        },
      }),
    [service.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t('brand_service.remove.title')}
          subtitle={t('brand_service.remove.subtitle', {
            name: service.name,
          })}
          buttonLabel={t('brand_service.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onActionPress={onActionPress}
        />
      </FormView>
    </PageView>
  );
};
