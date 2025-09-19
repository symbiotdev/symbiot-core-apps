import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';
import { Button, EmptyView, PageView } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';

export const CreateBrandIntro = () => {
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
          onPress={() => router.push('/brand/new')}
        />
      </EmptyView>
    </PageView>
  );
}
