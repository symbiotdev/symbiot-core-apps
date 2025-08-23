import { useCallback } from 'react';
import { router } from 'expo-router';
import {
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();

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
            label={t('brand.information.title')}
            icon={<Icon name="InfoCircle" />}
            onPress={onInformationPress}
          />
          <ListItem
            label={t('brand.locations.title')}
            icon={<Icon name="MapPointWave" />}
            onPress={onLocationsPress}
          />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
