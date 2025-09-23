import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import { useBrandServiceDetailedByIdQuery } from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { BrandServiceForm } from '@symbiot-core-apps/brand-service';
import { useTranslation } from 'react-i18next';
import { useCallback, useLayoutEffect, useMemo } from 'react';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: service,
    isPending,
    error,
  } = useBrandServiceDetailedByIdQuery(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('brand_service.update.context_menu.remove.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push(`/services/${id}/remove`),
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

  if (!service || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <BrandServiceForm service={service} />;
};
