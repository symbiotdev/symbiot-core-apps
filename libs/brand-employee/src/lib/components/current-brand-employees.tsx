import {
  AnimatedList,
  Avatar,
  FormView,
  Icon,
  InitView,
  PageView,
  RegularText,
  SemiBoldText,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import {
  BrandEmployee,
  useCurrentBrandEmployeeListQuery,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { View } from 'tamagui';
import { router } from 'expo-router';
import { useCurrentBrandEmployeeState } from '@symbiot-core-apps/state';

export const CurrentBrandEmployees = () => {
  const headerHeight = useScreenHeaderHeight();
  const { currentList, setCurrentList } = useCurrentBrandEmployeeState();
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
          router.push(`/employee/update/${item.id}`);
        }}
      >
        <Avatar
          name={item.name}
          size={40}
          url={item.avatarXsUrl}
          color={item.avatarColor}
        />

        <View gap="$1" flex={1}>
          <SemiBoldText numberOfLines={1}>{item.name}</SemiBoldText>
          <RegularText color="$placeholderColor" numberOfLines={1}>
            {item.position}
          </RegularText>
        </View>

        <Icon name="ArrowRight" />
      </FormView>
    ),
    [],
  );

  return (
    <PageView ignoreTopSafeArea ignoreBottomSafeArea paddingBottom={0}>
      {!employees?.length ? (
        <InitView loading={isLoading} error={error} />
      ) : (
        <AnimatedList
          refreshing={isRefetching && !isLoading}
          expanding={isFetchingNextPage}
          data={employees}
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
      )}
    </PageView>
  );
};
