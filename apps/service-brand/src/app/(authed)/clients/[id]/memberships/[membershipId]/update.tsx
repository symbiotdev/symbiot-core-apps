import { UpdateBrandClientMembership } from '@symbiot-core-apps/brand-client';
import {
  useBrandClientDetailedByIdReq,
  useBrandClientMembershipByIdReq,
} from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  const { id, membershipId } = useLocalSearchParams<{
    id: string;
    membershipId: string;
  }>();
  const { data: client } = useBrandClientDetailedByIdReq(id, false);
  const {
    data: membership,
    error,
    isPending,
  } = useBrandClientMembershipByIdReq(id, membershipId);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('brand_client_membership.profile.context_menu.remove.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () =>
          router.push(`/clients/${id}/memberships/${membershipId}/remove`),
      } as ContextMenuItem,
    ],
    [id, membershipId, t],
  );

  const headerRight = useCallback(
    () => <ContextMenuPopover items={contextMenuItems} />,
    [contextMenuItems],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: client && `${client.firstname} ${client.lastname}`,
      headerRight,
    });
  }, [client, navigation, headerRight]);

  if (!membership || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <UpdateBrandClientMembership clientId={id} membership={membership} />;
};
