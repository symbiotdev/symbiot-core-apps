import {
  AnimatedList,
  Avatar,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  FormView,
  Icon,
  InitView,
  MediumText,
  NavigationBackground,
  RegularText,
  Search,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import {
  BrandEmployee,
  useCurrentBrandEmployeeListQuery,
} from '@symbiot-core-apps/api';
import { useCallback, useState } from 'react';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { View } from 'tamagui';
import { router } from 'expo-router';
import { useCurrentBrandEmployeeState } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CurrentBrandEmployees = ({
  navigateTo,
}: {
  navigateTo: 'update' | 'profile';
}) => {
  const { currentList, setCurrentList } = useCurrentBrandEmployeeState();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useScreenHeaderHeight();

  const [search, setSearch] = useState('');

  const {
    items: employees,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useCurrentBrandEmployeeListQuery({
    initialState: currentList,
    setInitialState: setCurrentList,
    params: {
      ...(!!search && {
        search,
      }),
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: BrandEmployee }) => (
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
          router.push(`/employees/${item.id}/${navigateTo}`);
        }}
      >
        <Avatar
          name={item.name}
          size={40}
          url={item.avatarXsUrl}
          color={item.avatarColor}
        />

        <View gap="$1" flex={1}>
          <MediumText numberOfLines={1}>{item.name}</MediumText>
          <RegularText
            color="$placeholderColor"
            numberOfLines={1}
            lineHeight={20}
          >
            {item.role}
          </RegularText>
        </View>

        <Icon name="ArrowRight" />
      </FormView>
    ),
    [navigateTo],
  );

  const ListEmptyComponent = useCallback(
    () => <EmptyView iconName="Magnifer" message={t('shared.nothing_found')} />,
    [t],
  );

  if (!employees?.length && !search) {
    return <InitView loading={isLoading} error={error} />;
  }

  return (
    <>
      <ContainerView flex={1} paddingVertical={defaultPageVerticalPadding}>
        <AnimatedList
          refreshing={isRefetching && !isLoading}
          expanding={isFetchingNextPage}
          data={employees}
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
          placeholder={t('brand_employee.search.placeholder')}
          inputFieldProps={{ backgroundColor: '$background' }}
          onChange={setSearch}
        />
      </KeyboardStickyView>
    </>
  );
};
