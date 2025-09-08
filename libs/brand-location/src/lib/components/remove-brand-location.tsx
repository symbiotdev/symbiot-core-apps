import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import {
  BrandLocation,
  useRemoveBrandLocationQuery,
} from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export const RemoveBrandLocation = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useRemoveBrandLocationQuery();

  const onActionPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand.locations.remove.confirm_dialog.title'),
        message: t('brand.locations.remove.confirm_dialog.message'),
        callback: async () => {
          await mutateAsync({ id: location.id });

          router.dismissTo('/brand/locations');
        },
      }),
    [location.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t('brand.locations.remove.title')}
          subtitle={t('brand.locations.remove.subtitle', {
            name: location.name,
          })}
          buttonLabel={t('brand.locations.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onActionPress={onActionPress}
        />
      </FormView>
    </PageView>
  );
};
