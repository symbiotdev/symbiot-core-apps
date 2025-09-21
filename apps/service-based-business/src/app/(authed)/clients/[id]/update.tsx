import { UpdateBrandClient } from '@symbiot-core-apps/brand-client';
import { useTranslation } from 'react-i18next';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useBrandClientDetailedByIdQuery } from '@symbiot-core-apps/api';
import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import { useCallback, useLayoutEffect, useMemo } from 'react';

export default () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const {
    data: client,
    error,
    isPending,
  } = useBrandClientDetailedByIdQuery(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('brand_client.update.context_menu.remove.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push(`/clients/${id}/remove`),
      } as ContextMenuItem,
    ],
    [id, t],
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

  if (!client || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <UpdateBrandClient client={client} />;
};
