import { ActionCard, FrameView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import {
  BrandMembership,
  BrandMembershipType,
  getTranslateKeyByBrandMembership,
  useRemoveBrandMembershipReq,
} from '@symbiot-core-apps/api';
import { router } from 'expo-router';

export const RemoveBrandMembership = ({
  type,
  membership,
}: {
  membership: BrandMembership;
  type: BrandMembershipType;
}) => {
  const { t } = useI18n();
  const { mutateAsync, isPending } = useRemoveBrandMembershipReq();
  const tPrefix = getTranslateKeyByBrandMembership(membership);

  const onPress = useCallback(
    () =>
      ConfirmAlert({
        title: t(`${tPrefix}.remove.confirm_dialog.title`),
        message: t(`${tPrefix}.remove.confirm_dialog.message`),
        onAgree: async () => {
          await mutateAsync({ id: membership.id });

          router.dismissAll();
          router.push(`/memberships/${type}`);
        },
      }),
    [membership.id, type, mutateAsync, t, tPrefix],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FrameView>
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
      </FrameView>
    </PageView>
  );
};
