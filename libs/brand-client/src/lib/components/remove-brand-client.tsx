import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { BrandClient, useRemoveBrandClientQuery } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export const RemoveBrandClient = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useRemoveBrandClientQuery();

  const onPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand_client.remove.confirm_dialog.title'),
        message: t('brand_client.remove.confirm_dialog.message'),
        callback: async () => {
          await mutateAsync({ id: client.id });

          router.dismissAll();
          router.push('/clients');
        },
      }),
    [client.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t('brand_client.remove.title')}
          subtitle={t('brand_client.remove.subtitle', {
            name: `${client.firstname} ${client.lastname}`,
          })}
          buttonLabel={t('brand_client.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onPress={onPress}
        />
      </FormView>
    </PageView>
  );
};
