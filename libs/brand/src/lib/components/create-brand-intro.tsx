import { useAppSettings } from '@symbiot-core-apps/app';
import { Button } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useI18n } from '@symbiot-core-apps/shared';
import { EmptyView, ScrollablePage } from '@symbiot-core-apps/ui2';

export const CreateBrandIntro = () => {
  const { icons } = useAppSettings();
  const { t } = useI18n();

  return (
    <ScrollablePage>
      <EmptyView
        iconName={icons.Workspace}
        title={t('brand.create.intro.title')}
        message={t('brand.create.intro.subtitle')}
      >
        <Button
          label={t('brand.create.intro.button.label')}
          onPress={() => router.push('/brand/new')}
        />
      </EmptyView>
    </ScrollablePage>
  );
};
