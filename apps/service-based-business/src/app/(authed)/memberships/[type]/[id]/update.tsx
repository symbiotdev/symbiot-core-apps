import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import {
  BrandMembershipType,
  useBrandMembershipDetailedByIdQuery,
} from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { UpdateBrandMembership } from '@symbiot-core-apps/brand-membership';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandMembershipType;
  }>();
  const {
    data: membership,
    isPending,
    error,
  } = useBrandMembershipDetailedByIdQuery(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('brand_membership.update.context_menu.remove.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push(`/memberships/${type}/${id}/remove`),
      } as ContextMenuItem,
    ],
    [id, type, t],
  );

  const headerRight = useCallback(
    () => <ContextMenuPopover items={contextMenuItems} />,
    [contextMenuItems],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [headerRight, navigation]);

  if (!membership || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <UpdateBrandMembership membership={membership} />;
};
