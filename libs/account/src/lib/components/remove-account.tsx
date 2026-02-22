import { ActionCard, CompactView } from '@symbiot-core-apps/ui';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { useCallback } from 'react';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import { useAccountRemoveMeReq } from '@symbiot-core-apps/api';
import { Icon, ScrollablePage } from '@symbiot-core-apps/ui2';

export const RemoveAccount = () => {
  const { t } = useI18n();
  const { me } = useCurrentAccountState();
  const { mutateAsync, isPending } = useAccountRemoveMeReq();

  const onPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('shared.account.remove.confirm_dialog.title'),
        message: t('shared.account.remove.confirm_dialog.message'),
        onAgree: mutateAsync,
      }),
    [mutateAsync, t],
  );

  return (
    <ScrollablePage>
      <CompactView>
        <ActionCard
          title={t('shared.account.remove.title')}
          subtitle={t('shared.account.remove.subtitle', {
            name: me?.name,
          })}
          buttonLabel={t('shared.account.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onPress={onPress}
        />
      </CompactView>
    </ScrollablePage>
  );
};
