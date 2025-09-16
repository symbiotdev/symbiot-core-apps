import { useTranslation } from 'react-i18next';
import { Button, EmptyView, InitView, PageView } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useApp } from '@symbiot-core-apps/app';

export const CurrentBrandServices = ({
  navigateTo,
}: {
  navigateTo: 'update' | 'profile';
}) => {
  const loading = false;
  const error = undefined;

  return <Intro loading={loading} error={error} />;
};

const Intro = ({
  loading,
  error,
}: {
  loading?: boolean;
  error?: string | null;
}) => {
  const { t } = useTranslation();
  const { icons } = useApp();

  if (loading || error) {
    return <InitView loading={loading} error={error} />;
  } else {
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
          iconName={icons.Service}
          title={t('brand.services.upsert.intro.title')}
          message={t('brand.services.upsert.intro.subtitle')}
        >
          <Button
            label={t('brand.services.upsert.intro.button.label')}
            onPress={() => router.push('/services/create')}
          />
        </EmptyView>
      </PageView>
    );
  }
};
