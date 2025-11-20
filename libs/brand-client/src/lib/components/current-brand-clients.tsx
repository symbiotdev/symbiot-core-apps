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
import {
  BrandClient,
  useBrandClientCurrentListReq,
} from '@symbiot-core-apps/api';
import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { BrandClientItem } from '@symbiot-core-apps/brand';
import { useTheme } from 'tamagui';

export const CurrentBrandClients = ({
  offsetTop,
  hideArrow,
  disabledIds,
  onClientPress,
}: {
  offsetTop?: number;
  hideArrow?: boolean;
  disabledIds?: string[];
  onClientPress: (client: BrandClient) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();

  const [search, setSearch] = useState('');

  const {
    items: clients,
    isFetchingNextPage,
    isManualRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useBrandClientCurrentListReq({
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

  if (!clients?.length && !search) {
    return <Intro loading={isLoading} error={error} />;
  }

  return (
    <>
      <ContainerView flex={1} paddingVertical={defaultPageVerticalPadding}>
        <AnimatedList
          keyboardDismissMode="on-drag"
          refreshing={isManualRefetching}
          expanding={isFetchingNextPage}
          data={clients}
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
            <BrandClientItem
              padding="$4"
              borderRadius="$10"
              backgroundColor="$background1"
              client={item}
              hideArrow={hideArrow}
              disabled={disabledIds?.includes(item.id)}
              onPress={() => onClientPress(item)}
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
          borderTopColor={theme?.$background1?.val}
        />

        <Search
          value={search}
          debounce={300}
          placeholder={t('brand_client.search.placeholder')}
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
          title={t('brand_client.create.intro.title')}
          message={t('brand_client.create.intro.subtitle')}
        >
          <Button
            label={t('brand_client.create.intro.button.label')}
            onPress={() => router.push('/clients/create')}
          />
        </EmptyView>
      </PageView>
    );
  }
};
