import {
  AnimatedList,
  Avatar,
  Button,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  FormView,
  Icon,
  InitView,
  MediumText,
  NavigationBackground,
  PageView,
  Search,
} from '@symbiot-core-apps/ui';
import {
  BrandClient,
  useBrandClientCurrentListQuery,
} from '@symbiot-core-apps/api';
import { useCallback, useState } from 'react';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardStickyView } from 'react-native-keyboard-controller';

export const CurrentBrandClients = ({
  offsetTop,
  onClientPress,
}: {
  offsetTop?: number;
  onClientPress: (client: BrandClient) => void;
}) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const [search, setSearch] = useState('');

  const {
    items: clients,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useBrandClientCurrentListQuery({
    params: {
      ...(!!search && {
        search,
      }),
    },
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
          onClientPress(item);
        }}
      >
        <Avatar
          name={`${item.firstname} ${item.lastname}`}
          size={40}
          url={item.avatarXsUrl}
        />

        <MediumText numberOfLines={1} flex={1}>
          {`${item.firstname} ${item.lastname}`}
        </MediumText>

        <Icon name="ArrowRight" />
      </FormView>
    ),
    [onClientPress],
  );

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
          refreshing={isRefetching && !isLoading}
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
