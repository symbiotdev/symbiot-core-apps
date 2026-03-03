import { UpdateBrandLocation } from '@symbiot-core-apps/brand-location';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useBrandLocationByIdReq } from '@symbiot-core-apps/api';
import { useLayoutEffect, useMemo } from 'react';
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
  const { data: location, error, isPending } = useBrandLocationByIdReq(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('brand_location.update.context_menu.remove.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: 'red',
        onPress: () => router.push(`/locations/${id}/remove`),
      },
    ],
    [t, id],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      ...(contextMenuItems.length && {
        headerRight: () => <ContextMenu items={contextMenuItems} />,
      }),
    });
  }, [contextMenuItems, navigation]);

  if (!location || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <UpdateBrandLocation location={location} />;
};
