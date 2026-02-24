import { useBrandServiceDetailedByIdReq } from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { UpdateBrandService } from '@symbiot-core-apps/brand-service';
import { useCallback, useLayoutEffect, useMemo } from 'react';
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: service,
    isPending,
    error,
  } = useBrandServiceDetailedByIdReq(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('brand_service.update.context_menu.remove.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        // fixme colorize
        color: 'red',
        onPress: () => router.push(`/services/${id}/remove`),
      } as ContextMenuItem,
    ],
    [id, t],
  );

  const headerRight = useCallback(
    () => <ContextMenu items={contextMenuItems} />,
    [contextMenuItems],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [headerRight, navigation]);

  if (!service || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <UpdateBrandService service={service} />;
};
