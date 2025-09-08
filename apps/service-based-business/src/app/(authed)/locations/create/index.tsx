import { useTranslation } from 'react-i18next';
import { Button, EmptyView, PageView } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';

export default () => {
  const { t } = useTranslation();

  return (
    <PageView
      scrollable
      animation="medium"
      opacity={1}
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
    >
      <EmptyView
        padding={0}
        iconName="MapPointWave"
        title={t('brand.locations.upsert.intro.title')}
        message={t('brand.locations.upsert.intro.subtitle')}
      >
        <Button
          label={t('brand.locations.upsert.intro.button.label')}
          onPress={() => router.push('/locations/create/new')}
        />
      </EmptyView>
    </PageView>
  );
};
