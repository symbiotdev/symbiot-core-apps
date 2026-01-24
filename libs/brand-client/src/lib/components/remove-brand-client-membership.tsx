import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import {
  AnyBrandClientMembership,
  useRemoveBrandClientMembershipReq,
} from '@symbiot-core-apps/api';
import { router } from 'expo-router';

export const RemoveBrandClientMembership = ({
  clientId,
  membership,
}: {
  clientId: string;
  membership: AnyBrandClientMembership;
}) => {
  const { t } = useI18n();
  const { mutateAsync, isPending } = useRemoveBrandClientMembershipReq();

  const onPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand_client_membership.remove.confirm_dialog.title'),
        message: t('brand_client_membership.remove.confirm_dialog.message'),
        onAgree: async () => {
          await mutateAsync({ clientId, membershipId: membership.id });

          router.dismissTo(`/clients/${clientId}/profile`);
        },
      }),
    [clientId, membership.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t('brand_client_membership.remove.title')}
          subtitle={t('brand_client_membership.remove.subtitle', {
            name: membership.name,
          })}
          buttonLabel={t('brand_client_membership.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onPress={onPress}
        />
      </FormView>
    </PageView>
  );
};
