import {
  getTranslateKeyByBrandMembershipType,
  useBrandMembershipDetailedByIdReq,
} from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo } from 'react';
import { UpdateBrandMembership } from '@symbiot-core-apps/brand-membership';
import { useI18n } from '@symbiot-core-apps/shared';
import {
  ContextMenu,
  ContextMenuItem,
  FallbackView,
  Icon,
} from '@symbiot-core-apps/ui2';

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
              // fixme colorize
              color: 'red',
              onPress: () => router.push(`/memberships/${id}/remove`),
            } as ContextMenuItem,
          ]
        : [],
    [id, membership?.type, t],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: membership?.type
        ? t(
            `${getTranslateKeyByBrandMembershipType(membership.type)}.update.title`,
          )
        : '',
      ...(contextMenuItems.length && {
        headerRight: () => <ContextMenu items={contextMenuItems} />,
      }),
    });
  }, [contextMenuItems, membership?.type, navigation, t]);

  if (!membership || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <UpdateBrandMembership membership={membership} />;
};
