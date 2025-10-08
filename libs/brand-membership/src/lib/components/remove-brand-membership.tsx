import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import {
  BrandMembership,
  BrandMembershipType,
  getTranslateKeyByBrandMembership,
  useRemoveBrandMembershipQuery,
} from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export const RemoveBrandMembership = ({
  type,
  membership,
}: {
  membership: BrandMembership;
  type: BrandMembershipType;
}) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useRemoveBrandMembershipQuery();
  const tPrefix = getTranslateKeyByBrandMembership(membership);

  const onPress = useCallback(
    () =>
      ConfirmAlert({
        title: t(`${tPrefix}.remove.confirm_dialog.title`),
        message: t(`${tPrefix}.remove.confirm_dialog.message`),
        callback: async () => {
          await mutateAsync({ id: membership.id });

          router.dismissAll();
          router.push(`/memberships/${type}`);
        },
      }),
    [membership.id, type, mutateAsync, t, tPrefix],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t(`${tPrefix}.remove.title`)}
          subtitle={t(`${tPrefix}.remove.subtitle`, {
            name: membership.name,
          })}
          buttonLabel={t(`${tPrefix}.remove.button.label`)}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onPress={onPress}
        />
      </FormView>
    </PageView>
  );
};
