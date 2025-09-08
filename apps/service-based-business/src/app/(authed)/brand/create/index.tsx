import { Button, EmptyView, PageView } from '@symbiot-core-apps/ui';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export default () => {
  const { icons } = useApp();
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
        iconName={icons.Workspace}
        title={t('brand.create.intro.title')}
        message={t('brand.create.intro.subtitle')}
      >
        <Button
          label={t('brand.create.intro.button.label')}
          onPress={() => router.push('/brand/create')}
        />
      </EmptyView>
    </PageView>
  );
};
