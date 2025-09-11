import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { BrandClient, useRemoveBrandClientQuery } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export const RemoveBrandClient = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useRemoveBrandClientQuery();

  const onActionPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand.clients.remove.confirm_dialog.title'),
        message: t('brand.clients.remove.confirm_dialog.message'),
        callback: async () => {
          await mutateAsync({ id: client.id });

          router.dismissTo('/clients');
        },
      }),
    [client.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t('brand.clients.remove.title')}
          subtitle={t('brand.clients.remove.subtitle', {
            name: `${client.firstname} ${client.lastname}`,
          })}
          buttonLabel={t('brand.clients.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onActionPress={onActionPress}
        />
      </FormView>
    </PageView>
  );
};
