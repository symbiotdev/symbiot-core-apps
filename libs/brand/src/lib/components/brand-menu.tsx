import {
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { useT } from '@symbiot-core-apps/i18n';
import { useCallback } from 'react';
import { router } from 'expo-router';

export const BrandMenu = () => {
  const { t } = useT();

  const onInformationPress = useCallback(
    () => router.push('/brand/menu/information/preferences'),
    [],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ListItemGroup>
          <ListItem
            label={t('brand.information.title', { ns: 'app' })}
            icon={<Icon name="InfoCircle" />}
            onPress={onInformationPress}
          />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
