import { ActionCard, CompactView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import {
  BrandLocation,
  useRemoveBrandLocationReq,
} from '@symbiot-core-apps/api';
import { router } from 'expo-router';

export const RemoveBrandLocation = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useI18n();
  const { mutateAsync, isPending } = useRemoveBrandLocationReq();

  const onActionPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand_location.remove.confirm_dialog.title'),
        message: t('brand_location.remove.confirm_dialog.message'),
        onAgree: async () => {
          await mutateAsync({ id: location.id });

          router.dismissAll();
          router.push('/locations');
        },
      }),
    [location.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <CompactView>
        <ActionCard
          title={t('brand_location.remove.title')}
          subtitle={t('brand_location.remove.subtitle', {
            name: location.name,
          })}
          buttonLabel={t('brand_location.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onPress={onActionPress}
        />
      </CompactView>
    </PageView>
  );
};
