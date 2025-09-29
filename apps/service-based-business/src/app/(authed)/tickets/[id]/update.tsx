import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import { useBrandTicketDetailedByIdQuery } from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { UpdateBrandTicket } from '@symbiot-core-apps/brand-ticket';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: ticket,
    isPending,
    error,
  } = useBrandTicketDetailedByIdQuery(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('brand_ticket.update.context_menu.remove.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push(`/tickets/${id}/remove`),
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

  if (!ticket || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <UpdateBrandTicket ticket={ticket} />;
};
