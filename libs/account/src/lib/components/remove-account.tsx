import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useMe } from '@symbiot-core-apps/state';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { useAccountRemoveMe } from '@symbiot-core-apps/api';

export const RemoveAccount = () => {
  const { t } = useTranslation();
  const { me } = useMe();
  const { mutateAsync, isPending } = useAccountRemoveMe();

  const onActionPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('shared.preferences.remove_account.confirm_dialog.title'),
        message: t('shared.preferences.remove_account.confirm_dialog.message'),
        callback: mutateAsync,
      }),
    [mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t('shared.preferences.remove_account.title')}
          subtitle={t('shared.preferences.remove_account.subtitle', {
            name: me?.name,
          })}
          buttonLabel={t('shared.preferences.remove_account.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onActionPress={onActionPress}
        />
      </FormView>
    </PageView>
  );
};
