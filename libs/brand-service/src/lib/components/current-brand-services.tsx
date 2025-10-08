import { useTranslation } from 'react-i18next';
import {
  AnimatedList,
  Button,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  InitView,
  NavigationBackground,
  PageView,
  Search,
} from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useApp } from '@symbiot-core-apps/app';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import {
  BrandService,
  useBrandServiceCurrentListQuery,
} from '@symbiot-core-apps/api';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { BrandServiceItem } from '@symbiot-core-apps/brand';

export const CurrentBrandServices = ({
  offsetTop,
  onServicePress,
}: {
  offsetTop?: number;
  onServicePress: (service: BrandService) => void;
}) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const [search, setSearch] = useState('');

  const {
    items: services,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useBrandServiceCurrentListQuery({
    params: {
      ...(!!search && {
        search,
      }),
    },
  });

  const ListEmptyComponent = useCallback(
    () => <EmptyView iconName="Magnifer" message={t('shared.nothing_found')} />,
    [t],
  );

  if (!services?.length && !search) {
    return <Intro loading={isLoading} error={error} />;
  }

  return (
    <>
      <ContainerView flex={1} paddingVertical={defaultPageVerticalPadding}>
        <AnimatedList
          keyboardDismissMode="on-drag"
          refreshing={isRefetching && !isLoading}
          expanding={isFetchingNextPage}
          data={services}
          progressViewOffset={offsetTop}
          contentContainerStyle={{
            gap: 2,
            paddingTop: offsetTop,
            paddingHorizontal: defaultPageHorizontalPadding,
            paddingBottom: 100,
          }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({ item }) => (
            <BrandServiceItem
              backgroundColor="$background1"
              borderRadius="$10"
              padding="$4"
              service={item}
              onPress={() => onServicePress(item)}
            />
          )}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
        />
      </ContainerView>

      <KeyboardStickyView
        offset={{ opened: bottom }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          paddingTop: 10,
          paddingBottom: bottom + 10,
          paddingHorizontal: defaultPageHorizontalPadding,
          width: '100%',
          zIndex: 1,
        }}
      >
        <NavigationBackground
          borderTopWidth={1}
          borderTopColor="$background1"
        />

        <Search
          value={search}
          debounce={300}
          placeholder={t('brand_service.search.placeholder')}
          inputFieldProps={{ backgroundColor: '$background' }}
          onChange={setSearch}
        />
      </KeyboardStickyView>
    </>
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
          title={t('brand_service.create.intro.title')}
          message={t('brand_service.create.intro.subtitle')}
        >
          <Button
            label={t('brand_service.create.intro.button.label')}
            onPress={() => router.push('/services/create')}
          />
        </EmptyView>
      </PageView>
    );
  }
};
