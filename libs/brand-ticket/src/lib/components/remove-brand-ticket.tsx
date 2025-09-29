import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { BrandTicket, useRemoveBrandTicketQuery } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export const RemoveBrandTicket = ({ ticket }: { ticket: BrandTicket }) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useRemoveBrandTicketQuery();

  const onActionPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand_membership.remove.confirm_dialog.title'),
        message: t('brand_membership.remove.confirm_dialog.message'),
        callback: async () => {
          await mutateAsync({ id: ticket.id });

          router.dismissAll();
          router.push('/memberships');
        },
      }),
    [ticket.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t('brand_membership.remove.title')}
          subtitle={t('brand_membership.remove.subtitle', {
            name: ticket.name,
          })}
          buttonLabel={t('brand_membership.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onActionPress={onActionPress}
        />
      </FormView>
    </PageView>
  );
};
