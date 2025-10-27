import { UpdateBrandLocation } from '@symbiot-core-apps/brand-location';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useBrandLocationByIdReq } from '@symbiot-core-apps/api';
import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: location, error, isPending } = useBrandLocationByIdReq(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('brand_location.update.context_menu.remove.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push(`/locations/${id}/remove`),
      },
    ],
    [t, id],
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

  if (!location || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <UpdateBrandLocation location={location} />;
};
