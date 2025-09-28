import { useTranslation } from 'react-i18next';
import {
  AnimatedList,
  Button,
  Chip,
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
import { DateHelper, emitHaptic, formatPrice } from '@symbiot-core-apps/shared';
import { XStack } from 'tamagui';

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
        backgroundColor="$background1"
        borderRadius="$10"
        padding="$4"
        gap="$2"
        cursor="pointer"
        opacity={item.hidden ? 0.7 : 1}
        pressStyle={{ opacity: 0.8 }}
        onPress={() => {
          emitHaptic();
          router.push(`/services/${item.id}/${navigateTo}`);
        }}
      >
        <XStack flex={1}>
          <MediumText numberOfLines={2} flex={1}>
            {item.name}
          </MediumText>

          {item.price ? (
            <XStack gap="$2" alignItems="center">
              <RegularText>
                {formatPrice({
                  price: item.price,
                  discount: item.discount,
                  symbol: item.currency?.symbol,
                })}
              </RegularText>

              {!!item.discount && (
                <RegularText
                  textDecorationLine="line-through"
                  color="$placeholderColor"
                >
                  {formatPrice({
                    price: item.price,
                    symbol: item.currency?.symbol,
                  })}
                </RegularText>
              )}
            </XStack>
          ) : (
            <RegularText>{t('brand_service.free')}</RegularText>
          )}
        </XStack>

        <XStack flex={1} flexWrap="wrap" gap="$1">
          {item.duration && (
            <Chip
              label={DateHelper.formatDuration(item.duration, true)}
              size="small"
            />
          )}

          {item.type?.value && <Chip label={item.type.label} size="small" />}
          {item.format?.value && (
            <Chip label={item.format.label} size="small" />
          )}
          {item.gender?.value && (
            <Chip label={item.gender.label} size="small" />
          )}
        </XStack>
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
