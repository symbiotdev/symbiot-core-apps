import { useAppSettings } from '@symbiot-core-apps/app';
import { Button, EmptyView, PageView } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useI18n } from '@symbiot-core-apps/shared';

export const CreateBrandIntro = () => {
  const { icons } = useAppSettings();
  const { t } = useI18n();

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
};
