import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { useAccountRemoveMeReq } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';

export const RemoveAccount = () => {
  const { t } = useTranslation();
  const { me } = useCurrentAccountState();
  const { mutateAsync, isPending } = useAccountRemoveMeReq();

  const onPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('shared.account.remove.confirm_dialog.title'),
        message: t('shared.account.remove.confirm_dialog.message'),
        callback: mutateAsync,
      }),
    [mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
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
      </FormView>
    </PageView>
  );
};
