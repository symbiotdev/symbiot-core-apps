import {
  AnimatedList,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  InitView,
  NavigationBackground,
} from '@symbiot-core-apps/ui';
import {
  BrandEmployee,
  useBrandEmployeeCurrentListReq,
} from '@symbiot-core-apps/api';
import { useCallback, useState } from 'react';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandEmployeeItem } from '@symbiot-core-apps/brand';
import { useI18n } from '@symbiot-core-apps/shared';
import { Search } from '@symbiot-core-apps/form-controller';

export const CurrentBrandEmployees = ({
  offsetTop,
  onEmployeePress,
}: {
  offsetTop?: number;
  onEmployeePress: (employee: BrandEmployee) => void;
}) => {
  const { t } = useI18n();
  const { bottom } = useSafeAreaInsets();

  const [search, setSearch] = useState('');

  const {
    items: employees,
    isFetchingNextPage,
    isManualRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useBrandEmployeeCurrentListReq({
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

  if (!employees?.length && !search) {
    return <InitView loading={isLoading} error={error} />;
  }

  return (
    <>
      <ContainerView flex={1} paddingVertical={defaultPageVerticalPadding}>
        <AnimatedList
          refreshing={isManualRefetching}
          expanding={isFetchingNextPage}
          data={employees}
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
            <BrandEmployeeItem
              backgroundColor="$background1"
              borderRadius="$10"
              padding="$4"
              employee={item}
              onPress={() => onEmployeePress(item)}
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
        <NavigationBackground backgroundColor="$background1" />

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
