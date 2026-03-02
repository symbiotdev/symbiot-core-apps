import {
  BrandEmployee,
  useBrandEmployeeCurrentListReq,
} from '@symbiot-core-apps/api';
import { useCallback, useState } from 'react';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { BrandEmployeeItem } from '@symbiot-core-apps/brand';
import { useI18n, useInsets } from '@symbiot-core-apps/shared';
import { Search } from '@symbiot-core-apps/form-controller';
import {
  AnimatedList,
  EmptyView,
  FallbackView,
  GlassViewBackground,
  Page,
  PAGE_STYLE,
} from '@symbiot-core-apps/ui2';

export const CurrentBrandEmployees = ({
  offsetTop,
  onEmployeePress,
}: {
  offsetTop?: number;
  onEmployeePress: (employee: BrandEmployee) => void;
}) => {
  const { t } = useI18n();
  const { bottom } = useInsets({ ignoreAndroidIssue: true });

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
    return <FallbackView loading={isLoading} error={error} />;
  }

  return (
    <>
      <Page
        ignoreHeaderHeight
        ignoreTopSafeArea
        ignoreBottomSafeArea
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <AnimatedList
          refreshing={isManualRefetching}
          expanding={isFetchingNextPage}
          data={employees}
          progressViewOffset={offsetTop}
          contentContainerStyle={{
            gap: 2,
            paddingTop: offsetTop,
            paddingHorizontal: PAGE_STYLE.paddingHorizontal,
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
      </Page>

      <KeyboardStickyView
        offset={{ opened: bottom }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 10,
          paddingBottom: bottom + 10,
          paddingHorizontal: PAGE_STYLE.paddingHorizontal,
          marginHorizontal: -1,
          zIndex: 1,
        }}
      >
        <GlassViewBackground />

        <Search
          value={search}
          debounce={300}
          placeholder={t('brand_employee.search.placeholder')}
          inputFieldProps={{ backgroundColor: '$highlighted', zIndex: 1 }}
          onChange={setSearch}
        />
      </KeyboardStickyView>
    </>
  );
};
