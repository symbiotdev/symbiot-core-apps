import { useTranslation } from 'react-i18next';
import {
  AnimatedList,
  Button,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  FormView,
  InitView,
  MediumText,
  NavigationBackground,
  PageView,
  RegularText,
  Search,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useApp } from '@symbiot-core-apps/app';
import { useCurrentBrandServiceState } from '@symbiot-core-apps/state';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import {
  BrandService,
  useCurrentBrandServiceListQuery,
} from '@symbiot-core-apps/api';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { View, XStack } from 'tamagui';
import { formatBrandServicePrice } from '../utils/price';

export const CurrentBrandServices = ({
  navigateTo,
}: {
  navigateTo: 'update' | 'profile';
}) => {
  const { currentList, setCurrentList } = useCurrentBrandServiceState();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useScreenHeaderHeight();

  const [search, setSearch] = useState('');

  const {
    items: services,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useCurrentBrandServiceListQuery({
    initialState: currentList,
    setInitialState: setCurrentList,
    params: {
      ...(!!search && {
        search,
      }),
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: BrandService }) => (
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
          router.push(`/services/${item.id}/${navigateTo}`);
        }}
      >
        <View flex={1}>
          <MediumText numberOfLines={2} flex={1}>
            {item.name}
          </MediumText>
        </View>

        {item.price ? (
          <XStack gap="$2" alignItems="center">
            {!!item.discount && (
              <RegularText
                textDecorationLine="line-through"
                color="$placeholderColor"
              >
                {formatBrandServicePrice(item, true)}
              </RegularText>
            )}

            <RegularText>{formatBrandServicePrice(item)}</RegularText>
          </XStack>
        ) : (
          <RegularText>{t('brand.services.free')}</RegularText>
        )}
      </FormView>
    ),
    [navigateTo, t],
  );

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
          progressViewOffset={headerHeight}
          contentContainerStyle={{
            gap: 2,
            paddingTop: headerHeight,
            paddingHorizontal: defaultPageHorizontalPadding,
            paddingBottom: 100,
          }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={renderItem}
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
          placeholder={t('brand.services.search.placeholder')}
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
