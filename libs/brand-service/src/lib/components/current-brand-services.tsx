import { Button } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useAppSettings } from '@symbiot-core-apps/app';
import { useCallback, useState } from 'react';
import {
  BrandService,
  useBrandServiceCurrentListReq,
} from '@symbiot-core-apps/api';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { BrandServiceItem } from '@symbiot-core-apps/brand';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';
import { useI18n, useInsets } from '@symbiot-core-apps/shared';
import { Search } from '@symbiot-core-apps/form-controller';
import {
  AnimatedList,
  EmptyView,
  FallbackView,
  GlassViewBackground,
  Page,
  PAGE_STYLE,
  ScrollablePage,
} from '@symbiot-core-apps/ui2';

export const CurrentBrandServices = ({
  offsetTop,
  onServicePress,
}: {
  offsetTop?: number;
  onServicePress: (service: BrandService) => void;
}) => {
  const { t } = useI18n();
  const { bottom } = useInsets({ ignoreAndroidIssue: true });

  const [search, setSearch] = useState('');

  const {
    items: services,
    isFetchingNextPage,
    isManualRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useBrandServiceCurrentListReq({
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
      <Page
        ignoreHeaderHeight
        ignoreTopSafeArea
        ignoreBottomSafeArea
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <AnimatedList
          keyboardDismissMode="on-drag"
          refreshing={isManualRefetching}
          expanding={isFetchingNextPage}
          data={services}
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
          placeholder={t('brand_service.search.placeholder')}
          inputFieldProps={{ backgroundColor: '$highlighted', zIndex: 1 }}
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
  const { t } = useI18n();
  const { icons } = useAppSettings();
  const { tryAction } = useAccountLimits();

  if (loading || error) {
    return <FallbackView loading={loading} error={error} />;
  } else {
    return (
      <ScrollablePage ignoreHeaderHeight>
        <EmptyView
          iconName={icons.Service}
          title={t('brand_service.create.intro.title')}
          message={t('brand_service.create.intro.subtitle')}
        >
          <Button
            label={t('brand_service.create.intro.button.label')}
            onPress={tryAction('addService', () =>
              router.push('/services/create'),
            )}
          />
        </EmptyView>
      </ScrollablePage>
    );
  }
};
