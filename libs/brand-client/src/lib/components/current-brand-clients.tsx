import {
  AnimatedList,
  Avatar,
  Button,
  EmptyView,
  FormView,
  Icon,
  InitView,
  PageView,
  SemiBoldText,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { useCurrentBrandClientState } from '@symbiot-core-apps/state';
import {
  BrandClient,
  useCurrentBrandClientListQuery,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const CurrentBrandClients = () => {
  const { currentList, setCurrentList } = useCurrentBrandClientState();
  const headerHeight = useScreenHeaderHeight();
  const {
    items: clients,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useCurrentBrandClientListQuery({
    initialState: currentList,
    setInitialState: setCurrentList,
  });

  const renderItem = useCallback(
    ({ item }: { item: BrandClient }) => (
      <FormView
        alignItems="center"
        backgroundColor="$background1"
        borderRadius="$10"
        padding="$4"
        gap="$4"
        cursor="pointer"
        flexDirection="row"
        pressStyle={{ opacity: 0.8 }}
        onPress={() => {
          emitHaptic();
          router.push(`/clients/${item.id}/update`);
        }}
      >
        <Avatar
          name={`${item.firstname} ${item.lastname}`}
          size={40}
          url={item.avatarXsUrl}
        />

        <SemiBoldText numberOfLines={1} flex={1}>
          {`${item.firstname} ${item.lastname}`}
        </SemiBoldText>

        <Icon name="ArrowRight" />
      </FormView>
    ),
    [],
  );

  if (!clients?.length) {
    return <Intro loading={isLoading} error={error} />;
  }

  return (
    <PageView ignoreTopSafeArea ignoreBottomSafeArea>
      <AnimatedList
        refreshing={isRefetching && !isLoading}
        expanding={isFetchingNextPage}
        data={clients}
        progressViewOffset={headerHeight}
        contentContainerStyle={{
          gap: 2,
          paddingTop: headerHeight,
          paddingBottom: 100,
        }}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
      />
    </PageView>
  );
};

const Intro = ({
  loading,
  error,
}: {
  loading?: boolean;
  error?: string | null;
}) => {
  const { t } = useTranslation();

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
          iconName="SmileCircle"
          title={t('brand.clients.upsert.intro.title')}
          message={t('brand.clients.upsert.intro.subtitle')}
        >
          <Button
            label={t('brand.clients.upsert.intro.button.label')}
            onPress={() => router.push('/clients/create')}
          />
        </EmptyView>
      </PageView>
    );
  }
};
