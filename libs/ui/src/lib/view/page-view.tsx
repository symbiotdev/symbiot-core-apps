import { ReactNode } from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import { ScrollView, View, ViewProps } from 'tamagui';
import { LoadingView } from './loading-view';
import { useRendered } from '@symbiot-core-apps/shared';
import { Refresher } from '../loading/refresher';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenHeaderHeight } from '../navigation/header';

const isWeb = Platform.OS === 'web';
export const defaultPageHorizontalPadding = 14;
export const defaultPageVerticalPadding = 14;

export type PageViewProps = ViewProps & {
  lazy?: boolean;
  delay?: number;
  scrollable?: boolean;
  refreshing?: boolean;
  withKeyboard?: boolean;
  withHeaderHeight?: boolean;
  ignoreTopSafeArea?: boolean;
  ignoreBottomSafeArea?: boolean;
  LoadingElement?: ReactNode;
  onRefresh?: () => void;
};

export const PageView = ({
  lazy,
  delay,
  scrollable,
  refreshing,
  withKeyboard,
  withHeaderHeight,
  LoadingElement,
  onRefresh,
  ...viewProps
}: PageViewProps) => {
  const { rendered } = useRendered({ defaultTrue: lazy === false, delay });
  const headerHeight = useScreenHeaderHeight();

  if (!rendered) {
    return LoadingElement || <LoadingView />;
  }

  if (scrollable && withKeyboard) {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        contentContainerStyle={styles.FullScreen}
        showsHorizontalScrollIndicator={isWeb}
        showsVerticalScrollIndicator={isWeb}
        bottomOffset={30}
        refreshControl={
          refreshing !== undefined ? (
            <Refresher refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <PageContent withHeaderHeight={withHeaderHeight} {...viewProps} />
      </KeyboardAwareScrollView>
    );
  }

  if (withKeyboard) {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.FullScreen}
        keyboardVerticalOffset={withHeaderHeight ? headerHeight : undefined}
      >
        <PageContent withHeaderHeight={withHeaderHeight} {...viewProps} />
      </KeyboardAvoidingView>
    );
  }

  if (scrollable) {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={isWeb}
        showsVerticalScrollIndicator={isWeb}
        contentContainerStyle={styles.FullScreen}
        refreshControl={
          refreshing !== undefined ? (
            <Refresher refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <PageContent withHeaderHeight={withHeaderHeight} {...viewProps} />
      </ScrollView>
    );
  }

  return <PageContent withHeaderHeight={withHeaderHeight} {...viewProps} />;
};

const PageContent = ({
  withHeaderHeight = false,
  ignoreTopSafeArea = false,
  ignoreBottomSafeArea = false,
  paddingTop = defaultPageVerticalPadding,
  paddingBottom = defaultPageVerticalPadding,
  paddingLeft = defaultPageHorizontalPadding,
  paddingRight = defaultPageHorizontalPadding,
  ...viewProps
}: ViewProps & {
  withHeaderHeight?: boolean;
  ignoreTopSafeArea?: boolean;
  ignoreBottomSafeArea?: boolean;
}) => {
  const { top, bottom, left, right } = useSafeAreaInsets();
  const headerHeight = useScreenHeaderHeight();

  return (
    <View
      flex={1}
      width="100%"
      maxWidth={1440}
      marginHorizontal="auto"
      paddingTop={
        (withHeaderHeight ? headerHeight : !ignoreTopSafeArea ? top : 0) +
        Number(paddingTop)
      }
      paddingBottom={
        (!ignoreBottomSafeArea ? bottom : 0) + Number(paddingBottom)
      }
      paddingLeft={left + Number(paddingLeft)}
      paddingRight={right + Number(paddingRight)}
      {...viewProps}
    />
  );
};

const styles = StyleSheet.create({
  FullScreen: {
    flexGrow: 1,
  },
});
