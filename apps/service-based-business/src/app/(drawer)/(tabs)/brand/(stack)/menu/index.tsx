import { useT } from '@symbiot-core-apps/i18n';
import { useCallback } from 'react';
import { router } from 'expo-router';
import {
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';

export default () => {
  const { t } = useT();

  const onInformationPress = useCallback(
    () => router.push('/brand/menu/information/preferences'),
    [],
  );

  const onLocationsPress = useCallback(
    () => router.push('/brand/menu/locations'),
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
          <ListItem
            label={t('brand.locations.title', { ns: 'app' })}
            icon={<Icon name="MapPointWave" />}
            onPress={onLocationsPress}
          />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
