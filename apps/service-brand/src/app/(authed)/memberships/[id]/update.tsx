import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import {
  getTranslateKeyByBrandMembershipType,
  useBrandMembershipDetailedByIdReq,
} from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { UpdateBrandMembership } from '@symbiot-core-apps/brand-membership';
import { useI18n } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const {
    data: membership,
    isPending,
    error,
  } = useBrandMembershipDetailedByIdReq(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () =>
      membership?.type
        ? [
            {
              label: t(
                `${getTranslateKeyByBrandMembershipType(membership.type)}.update.context_menu.remove.label`,
              ),
              icon: <Icon name="TrashBinMinimalistic" />,
              color: '$error',
              onPress: () => router.push(`/memberships/${id}/remove`),
            } as ContextMenuItem,
          ]
        : [],
    [id, membership?.type, t],
  );

  const headerRight = useCallback(
    () => <ContextMenuPopover items={contextMenuItems} />,
    [contextMenuItems],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
      headerTitle: membership?.type
        ? t(
            `${getTranslateKeyByBrandMembershipType(membership.type)}.update.title`,
          )
        : '',
    });
  }, [headerRight, membership?.type, navigation, t]);

  if (!membership || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <UpdateBrandMembership membership={membership} />;
};
